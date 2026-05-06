import PolicyLayout from "./PolicyLayout";

const Refund = () => (
  <PolicyLayout title="Refund & Return Policy" lastUpdated="May 6, 2026">
    <p>
      Because our products are temperature-sensitive research compounds, we follow a strict policy
      to protect quality and prevent contamination. Please read this policy carefully before placing
      an order.
    </p>

    <h2>1. Order Cancellations</h2>
    <ul>
      <li>Orders may be canceled <strong>before</strong> they ship for a full refund of the order total. Cancel from your account dashboard or by emailing support.</li>
      <li>Once an order has shipped, it can no longer be canceled — please follow the return process below.</li>
      <li>If you redeemed points on a canceled order, the points are automatically returned to your balance.</li>
    </ul>

    <h2>2. Damaged, Defective, or Incorrect Items</h2>
    <p>
      We stand behind every shipment. If your order arrives damaged, defective, or incorrect, you
      are eligible for a free replacement or a full refund. To qualify:
    </p>
    <ul>
      <li>Notify us within <strong>3 business days</strong> of delivery at <a className="text-primary underline" href="mailto:support@cellsyncsolutions.com">support@cellsyncsolutions.com</a>.</li>
      <li>Include your order number, a description of the issue, and clear photos of the product, packaging, and shipping label.</li>
      <li>Do not discard the product or packaging until your claim is resolved.</li>
    </ul>

    <h2>3. Returns of Unopened Products</h2>
    <ul>
      <li>For non-defective items, returns may be accepted within <strong>7 days</strong> of delivery if the product is unopened, in original packaging, and was stored per label requirements.</li>
      <li>Return shipping is the customer's responsibility and must use a tracked, insured carrier.</li>
      <li>Approved returns are subject to a 15% restocking fee. Refunds are issued to the original payment method within 5–10 business days of receipt and inspection.</li>
    </ul>

    <h2>4. Non-Returnable Items</h2>
    <p>The following are <strong>not</strong> eligible for return or refund:</p>
    <ul>
      <li>Opened or used products.</li>
      <li>Products improperly stored after delivery (e.g., not refrigerated as labeled).</li>
      <li>Products purchased more than 7 days prior to the return request.</li>
      <li>Sale, clearance, or final-sale items.</li>
      <li>Custom or special-order items.</li>
    </ul>

    <h2>5. Refund Requests After Delivery</h2>
    <p>
      Eligible orders show a "Request refund" button on your account page. Submitting a request
      opens a case our team reviews within 2 business days. Approved refunds are issued to the
      original payment method; redeemed loyalty points are returned to your balance and points
      earned on the original order are removed.
    </p>

    <h2>6. Lost or Stolen Packages</h2>
    <p>
      All orders ship with tracking. Once a package is marked delivered by the carrier, we are not
      responsible for theft or loss. We will assist with carrier claims when possible. We strongly
      recommend shipping to a secure address.
    </p>

    <h2>7. Chargebacks</h2>
    <p>
      We make every effort to resolve issues directly. Filing a chargeback without first contacting
      us may result in account suspension and forfeiture of loyalty points. We respond to all
      chargebacks with full order documentation.
    </p>

    <h2>8. Contact</h2>
    <p>
      Refund questions: <a className="text-primary underline" href="mailto:support@cellsyncsolutions.com">support@cellsyncsolutions.com</a>. Please include your order number.
    </p>
  </PolicyLayout>
);

export default Refund;