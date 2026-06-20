import { useEffect, useState, useRef } from "react";
import {
  DollarSign,
  CreditCard,
  Link2,
  Hourglass,
  Percent,
  PiggyBank,
  Users,
  ArrowLeftRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchReferrals } from "../api/referrals";
import { formatDate, formatProfit } from "../utils/format";

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const debounceRef = useRef(null);

  // Debounce: wait 400ms after the user stops typing before updating searchTerm
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const navigate = useNavigate();

  async function loadReferrals(search, sort) {
    setIsLoading(true);
    setError("");
    try {
      const result = await fetchReferrals({ search, sort });
      setData(result);
      setCurrentPage(1); // reset to page 1 whenever the result set changes
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReferrals(searchTerm, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortOrder]);

  const referrals = data?.referrals || [];
  const totalEntries = referrals.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = referrals.slice(startIndex, startIndex + PAGE_SIZE);

  const fromCount = totalEntries === 0 ? 0 : startIndex + 1;
  const toCount = Math.min(startIndex + PAGE_SIZE, totalEntries);

  function handleSearchChange(e) {
    setSearchInput(e.target.value);
  }

  function handleSortChange(e) {
    setSortOrder(e.target.value);
  }

  const METRIC_ICONS = [
    { keyword: "balance", Icon: DollarSign },
    { keyword: "discount percentage", Icon: CreditCard },
    { keyword: "referral", Icon: Link2 },
    { keyword: "discount amount", Icon: Hourglass },
    { keyword: "commission amount", Icon: Percent },
    { keyword: "earning", Icon: PiggyBank },
    { keyword: "commission discount", Icon: Users },
    { keyword: "transfer", Icon: ArrowLeftRight },
  ];

  function getMetricIcon(label = "") {
    const lower = label.toLowerCase();
    const found = METRIC_ICONS.find((m) => lower.includes(m.keyword));
    return found ? found.Icon : DollarSign; // sensible fallback
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main>
        <header className="dashboard-header">
          <h1>Referral Dashboard</h1>
          <p>
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </header>

        {isLoading && <p>Loading...</p>}

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        {data && (
          <>
            {/* Overview */}
            <section aria-label="Overview metrics" className="overview-section">
              <h2>Overview</h2>
              <div className="metrics-grid">
                {data.metrics?.map((metric) => {
                  const Icon = getMetricIcon(metric.label);
                  return (
                    <div key={metric.id} className="metric-card">
                      <span className="metric-icon">
                        <Icon size={18} color="#fff" />
                      </span>
                      <p className="metric-value">{metric.value}</p>
                      <p className="metric-label">{metric.label}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Service Summary */}
            <section
              aria-label="Service summary"
              className="service-summary-section"
            >
              <h2>Service summary</h2>
              <dl className="service-summary-grid">
                <div className="summary-box">
                  <dt>Service</dt>
                  <dd className="summary-value-link">
                    {data.serviceSummary?.service}
                  </dd>
                </div>

                <div className="summary-box">
                  <dt>Your Referrals</dt>
                  <dd>{data.serviceSummary?.yourReferrals}</dd>
                </div>

                <div className="summary-box">
                  <dt>Active Referrals</dt>
                  <dd>{data.serviceSummary?.activeReferrals}</dd>
                </div>

                <div className="summary-box">
                  <dt>Total Ref. Earnings</dt>
                  <dd>{data.serviceSummary?.totalRefEarnings}</dd>
                </div>
              </dl>
            </section>

            {/* Share Referral */}
            <section
              aria-label="Share referral"
              className="share-referral-section"
            >
              <h2>Refer friends and earn more</h2>

              <div className="share-fields-row">
                <div className="share-field">
                  <label htmlFor="referral-link">Your Referral Link</label>
                  <div className="field-row">
                    <input
                      id="referral-link"
                      type="text"
                      readOnly
                      value={data.referral?.link || ""}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(data.referral?.link || "")
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="share-field">
                  <label htmlFor="referral-code">Your Referral Code</label>
                  <div className="field-row">
                    <input
                      id="referral-code"
                      type="text"
                      readOnly
                      value={data.referral?.code || ""}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(data.referral?.code || "")
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* All Referrals Table */}
            <section aria-label="All referrals" className="referrals-section">
              <h2>All referrals</h2>

              <div className="table-controls">
                <label htmlFor="search-referrals">
                  <span className="visually-hidden">Search referrals</span>
                  <input
                    id="search-referrals"
                    type="text"
                    placeholder="Name or service…"
                    aria-label="Search referrals"
                    value={searchInput}
                    onChange={handleSearchChange}
                  />
                </label>

                <label htmlFor="sort-by-date">
                  Sort by date
                  <select
                    id="sort-by-date"
                    value={sortOrder}
                    onChange={handleSortChange}
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No matching entries</td>
                    </tr>
                  ) : (
                    pageRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => navigate(`/referral/${row.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{row.name}</td>
                        <td>{row.serviceName}</td>
                        <td>{formatDate(row.date)}</td>
                        <td>{formatProfit(row.profit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="pagination">
                <p>
                  Showing {fromCount}–{toCount} of {totalEntries} entries
                </p>

                <div className="pagination-controls">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {totalPages > 1 &&
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          aria-current={
                            pageNum === currentPage ? "page" : undefined
                          }
                        >
                          {pageNum}
                        </button>
                      ),
                    )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
