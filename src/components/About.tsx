import logo from "@/assets/logo-mark.png";
import { useLanguage } from "@/i18n/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  const bullets: Array<string | JSX.Element> = [
    t("about_bullet_2"),
    (
      <>
        {t("about_bullet_4_pre")}
        <a
          href="https://www.nature.com/subjects/peptides"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          Nature
        </a>
        {t("about_bullet_4_post")}
      </>
    ),
  ];
  return (
  <section id="about" className="py-20 md:py-28 bg-background">
    <div className="container">
      <h2 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-16 uppercase">
        {t("about_title")}
      </h2>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="bg-navy rounded-2xl overflow-hidden shadow-card aspect-square">
          <img src={logo} alt={t("about_logo_alt")} width={1024} height={1024} loading="lazy" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-5 text-navy text-base md:text-lg leading-relaxed">
          <p>
            {t("about_p1_pre")}<strong>{t("about_p1_strong")}</strong>{t("about_p1_post")}
          </p>
          <p>
            {t("about_p2_pre")}<strong>{t("about_p2_strong")}</strong>{t("about_p2_post")}
          </p>
          <p>
            {t("about_p3_pre")}<strong>{t("about_p3_strong")}</strong>{t("about_p3_post")}
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
          <h3 className="text-2xl font-extrabold uppercase text-primary mb-3">{t("about_vision_title")}</h3>
          <p className="text-navy">{t("about_vision_body")}</p>
        </div>
        <div className="bg-secondary rounded-xl p-8 border-l-4 border-primary">
          <h3 className="text-2xl font-extrabold uppercase text-primary mb-3">{t("about_mission_title")}</h3>
          <p className="text-navy">{t("about_mission_body")}</p>
        </div>
      </div>
    </div>
  </section>
  );
};

export default About;