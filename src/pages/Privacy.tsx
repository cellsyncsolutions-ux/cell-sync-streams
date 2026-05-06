import PolicyLayout from "./PolicyLayout";

const Privacy = () => (
  <PolicyLayout title="Privacy Policy" lastUpdated="May 6, 2026">
    <p>
      This Privacy Policy describes how Cell Sync Solutions ("we," "us," or "our") collects, uses,
      and protects information when you visit cellsyncsolutions.com or place an order with us.
    </p>

    <h2>1. Information We Collect</h2>
    <ul>
      <li><strong>Account information:</strong> name, email, phone, password (hashed).</li>
      <li><strong>Order &amp; shipping information:</strong> shipping address, order history, points balance.</li>
      <li><strong>Payment information:</strong> processed by our PCI-compliant payment processor; we do <strong>not</strong> store full card numbers on our servers.</li>
      <li><strong>Usage information:</strong> IP address, browser type, pages visited, referring URL, and similar telemetry collected via cookies and standard server logs.</li>
    </ul>

    <h2>2. How We Use Information</h2>
    <ul>
      <li>To process orders, ship products, and provide customer support.</li>
      <li>To operate the loyalty points program and manage your account.</li>
      <li>To detect, prevent, and investigate fraud, abuse, or violations of our Terms.</li>
      <li>To send transactional emails (order confirmations, shipping updates, account notices).</li>
      <li>With your consent, to send marketing communications you may opt out of at any time.</li>
      <li>To comply with legal obligations and respond to lawful requests.</li>
    </ul>

    <h2>3. Sharing of Information</h2>
    <p>
      We do not sell your personal information. We share information only with:
    </p>
    <ul>
      <li>Service providers who help us operate (payment processor, shipping carriers, hosting, email).</li>
      <li>Law enforcement or regulators when legally required.</li>
      <li>A successor entity in connection with a merger, acquisition, or sale of assets.</li>
    </ul>

    <h2>4. Cookies</h2>
    <p>
      We use cookies and similar technologies for essential site functionality (login session, cart),
      analytics, and fraud prevention. You may disable cookies in your browser, but parts of the
      Site may not function properly.
    </p>

    <h2>5. Data Retention</h2>
    <p>
      We retain account and order data for as long as your account is active and as required to
      comply with tax, accounting, and legal obligations (typically 7 years for transaction
      records).
    </p>

    <h2>6. Security</h2>
    <p>
      We use industry-standard safeguards including encryption in transit (TLS), encryption at rest,
      role-based access controls, and row-level security on all customer data. No system is 100%
      secure; we cannot guarantee absolute security.
    </p>

    <h2>7. Your Rights</h2>
    <p>
      Depending on your jurisdiction, you may have the right to access, correct, delete, or export
      your personal data, and to opt out of certain processing. To exercise these rights, email{" "}
      <a className="text-primary underline" href="mailto:privacy@cellsyncsolutions.com">privacy@cellsyncsolutions.com</a>.
    </p>

    <h2>8. Children</h2>
    <p>
      The Site is not directed to anyone under 21. We do not knowingly collect information from
      minors.
    </p>

    <h2>9. International Users</h2>
    <p>
      The Site is operated from the United States. By using the Site, you consent to the transfer
      and processing of your information in the U.S.
    </p>

    <h2>10. Changes</h2>
    <p>
      We may update this Privacy Policy from time to time. The "Last updated" date above reflects
      the most recent revision.
    </p>

    <h2>11. Contact</h2>
    <p>
      Privacy questions: <a className="text-primary underline" href="mailto:privacy@cellsyncsolutions.com">privacy@cellsyncsolutions.com</a>.
    </p>
  </PolicyLayout>
);

export default Privacy;