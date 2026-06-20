import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchReferralById } from "../api/referrals";
import { formatDate, formatProfit } from "../utils/format";

export default function ReferralDetail() {
  const { id } = useParams();
  const [referral, setReferral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadReferral(id);
  }, [id]);

  async function loadReferral(referralId) {
    setIsLoading(true);
    setNotFound(false);
    setReferral(null);

    try {
      const data = await fetchReferralById(referralId);
      const match = resolveReferral(data, referralId);

      if (match) {
        setReferral(match);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      // failed fetch / 404 from API also counts as not-found for this page
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }

  // Handles both response shapes described in the spec:
  // 1) data IS the row: { id, name, serviceName, date, profit }
  // 2) data.referrals is an array, find the row with matching id
  function resolveReferral(data, referralId) {
    if (!data) return null;

    if (data.id !== undefined && String(data.id) === String(referralId)) {
      return data;
    }

    if (Array.isArray(data.referrals)) {
      return (
        data.referrals.find((row) => String(row.id) === String(referralId)) ||
        null
      );
    }

    return null;
  }

  return (
    <div className="referral-detail-page">
      <Navbar />

      <main>
        {isLoading && <p>Loading...</p>}

        {!isLoading && notFound && (
          <div className="not-found-block">
            <h1>Referral not found</h1>
            <Link to="/">← Back to dashboard</Link>
          </div>
        )}

        {!isLoading && !notFound && referral && (
          <>
            <Link to="/">← Back to dashboard</Link>
            <h1>Referral Details</h1>

            <div className="referral-detail-grid-wrapper">
              <div className="referral-detail-name-row">
                <h2>{referral.name}</h2>
                <span className="service-pill">{referral.serviceName}</span>
              </div>

              <dl className="referral-detail-grid">
                <dt>Referral ID</dt>
                <dd>{referral.id}</dd>

                <dt>Service Name</dt>
                <dd>{referral.serviceName}</dd>

                <dt>Date</dt>
                <dd>{formatDate(referral.date)}</dd>

                <dt>Profit</dt>
                <dd>{formatProfit(referral.profit)}</dd>
              </dl>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
