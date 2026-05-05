import logo from "@/assets/logo-mark.png";

const bullets: Array<string | JSX.Element> = [
  "Our goal is customer satisfaction and serving our community.",
  "We do what our competitors won't — answering the phone and replying to chats and emails within an hour or two.",
  "All products are for research and testing only. We cannot provide guidance on personal use.",
  (
    <>
      Visit{" "}
      <a
        href="https://pubmed.ncbi.nlm.nih.gov/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-semibold hover:underline"
      >
        PubMed
      </a>{" "}
      to learn more about peptide research.
    </>
  ),
];

const About = () => (
  <section id="about" className="py-20 md:py-28 bg-background">
    <div className="container">
      <h2 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-16 uppercase">
        About Us
      </h2>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="bg-navy rounded-2xl p-12 md:p-16 grid place-items-center shadow-card">
          <img src={logo} alt="Cell Sync Solutions logo" width={1024} height={1024} loading="lazy" className="w-full max-w-xs" />
        </div>

        <div className="space-y-5 text-navy text-base md:text-lg leading-relaxed">
          <p>
            Welcome to <strong>Cell Sync Solutions</strong>. We're a family-run business that began in late 2023, and in just two years
            we've evolved from importing products to working directly with a <strong>US-Based manufacturer</strong> that follows strict
            cGMP guidelines. Every product in our store is carefully chosen based on <strong>clinical data</strong>, proven{" "}
            <strong>efficacy</strong>, and <strong>consistency</strong> — ensuring that from packaging to performance, our high standards remain constant.
          </p>
          <p>
            We truly invest in our customers. We track every question, issue, and piece of feedback — whether it comes through chat,
            phone, or email — so you always receive the support you need.
          </p>
          <p>
            <strong>Cell Sync Solutions</strong> isn't just a business; it's a community. We're dedicated to offering the{" "}
            <strong>highest quality</strong> research use only peptides at fair prices. <strong>Trust</strong> is our foundation,
            and we'd rather close our doors than compromise on quality or the integrity of our community.
          </p>
          <p>
            We're here to <strong>support</strong> and <strong>empower</strong> research organizations to explore the potential of
            peptides. Thank you for choosing Cell Sync Solutions, where <strong>quality</strong>, commitment, and research always come first.
          </p>
        </div>
      </div>

      <ul className="mt-16 max-w-4xl mx-auto space-y-3 text-navy">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-20 grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="bg-secondary rounded-xl p-8 border-l-4 border-primary">
          <h3 className="text-2xl font-extrabold uppercase text-primary mb-3">Our Vision</h3>
          <p className="text-navy">To be the most trusted source for research peptides by upholding uncompromising standards in quality, transparency, and scientific integrity.</p>
        </div>
        <div className="bg-secondary rounded-xl p-8 border-l-4 border-primary">
          <h3 className="text-2xl font-extrabold uppercase text-primary mb-3">Our Mission</h3>
          <p className="text-navy">Empower laboratories with cGMP-manufactured, independently tested peptides backed by responsive, human support.</p>
        </div>
      </div>
    </div>
  </section>
);

export default About;