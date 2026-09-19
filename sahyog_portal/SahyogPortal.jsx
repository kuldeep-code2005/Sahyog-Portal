import { useState } from "react";
import styles from "./SahyogPortal.module.css";

/**
 * ---------------------------------------------------------------------------
 * Config / content
 * ---------------------------------------------------------------------------
 * Pulling copy, links and image paths out into plain data makes the file
 * easy to localize, theme, or feed from a CMS/API later without touching
 * any JSX. Swap these values (or pass overrides via props) instead of
 * editing markup.
 */

const DEFAULT_ASSETS = {
  logo3: "3.png",
  logo4: "4.png",
  logo6: "6.png",
  logo2: "2.png",
  loginBanner: "1.png",
  shield: "5.png",
};

const CONTENT = {
  govBlock: { hindi: "भारत सरकार", eng: "GOVERNMENT OF INDIA" },
  mhaBlock: { hindi: "गृह मंत्रालय", eng: "MINISTRY OF HOME AFFAIRS" },
  nodalOfficersLink: {
    href: "pdf/Nodal_officer_list.pdf",
    label: "Contact Details of the Authorized Officers",
  },
  brand: {
    hindiTitle: "सहयोग पोर्टल",
    engTitle: "Sahyog Portal",
    subtitle: "ELECTRONICS AND\nINFORMATION TECHNOLOGY",
  },
  vision: {
    label: "VISION",
    text: "To create a safe cyber space for the citizens of India.",
  },
  mission: {
    label: "MISSION",
    text: "To create an effective framework and ecosystem for the prevention, detection, investigation, and prosecution of Cybercrime in the country .",
  },
  aboutParagraph:
    "'Sahyog' Portal has been developed to automate the process of sending notices to intermediaries by the Appropriate Government or its agency under IT Act, 2000 to facilitate the removal or disabling of access to any information, data or communication link being used to commit an unlawful act. It will bring together all Authorized Agencies of the country and all the intermediaries on one platform for ensuring immediate action against the unlawful online information. This portal will help achieve a safe cyber space for the Citizens of India.",
  forgotPasswordHref: "pages/ResetPassword.aspx",
};

/** Simple inline icon set, kept local since they're only used in the login form. */
const Icons = {
  User: (props) => (
    <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  Lock: (props) => (
    <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
};

/**
 * ---------------------------------------------------------------------------
 * Subcomponents
 * ---------------------------------------------------------------------------
 * Splitting the page into small, single-purpose pieces makes each region
 * independently testable/reusable and keeps the top-level component
 * readable as the page grows.
 */

function TopHeader() {
  return (
    <div className={styles.topHeader}>
      <div className={styles.topHeaderCenter}>
        <div className={styles.govBlock}>
          <span className={styles.hindi}>{CONTENT.govBlock.hindi}</span>
          <span className={styles.eng}>{CONTENT.govBlock.eng}</span>
        </div>
        <div className={styles.headerDivider} />
        <div className={styles.mhaBlock}>
          <span className={styles.hindi}>{CONTENT.mhaBlock.hindi}</span>
          <span className={styles.eng}>{CONTENT.mhaBlock.eng}</span>
        </div>
      </div>

      <div className={styles.topHeaderRight}>
        <a href={CONTENT.nodalOfficersLink.href} target="_blank" rel="noopener noreferrer">
          {CONTENT.nodalOfficersLink.label}
        </a>
      </div>
    </div>
  );
}

function BrandHeader({ assets }) {
  return (
    <header className={styles.brandHeader}>
      <div className={styles.brandLeft}>
        <div className={styles.brandTitleGroup}>
          <span className={styles.hindiTitle}>{CONTENT.brand.hindiTitle}</span>
          <span className={styles.engTitle}>{CONTENT.brand.engTitle}</span>
        </div>

        <img src={assets.logo3} alt="Logo 3" className={styles.headerInlineImg} />
        <img src={assets.logo4} alt="Logo 4" className={styles.headerInlineImg} />

        <div className={styles.brandSubtitle}>
          {CONTENT.brand.subtitle.split("\n").map((line, i, arr) => (
            <span key={line}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.brandRight}>
        <img src={assets.logo6} alt="Logo 6" className={styles.brandRightImg} />
        <img src={assets.logo2} alt="Logo 2" className={styles.brandRightImg} />
      </div>
    </header>
  );
}

function VisionMissionColumn() {
  const items = [CONTENT.vision, CONTENT.mission];
  return (
    <section className={styles.leftColumn}>
      {items.map((item) => (
        <div className={styles.sectionBlock} key={item.label}>
          <div className={styles.headerLineRow}>
            <div className={styles.blueCircle} />
            <span className={styles.headerTextLabel}>{item.label}</span>
            <div className={styles.horizontalLine} />
          </div>
          <p className={styles.sectionDescription}>{item.text}</p>
        </div>
      ))}
    </section>
  );
}

/**
 * Login form. Kept uncontrolled-friendly (plain onSubmit) but with real
 * React state for the fields, so the parent app can eventually wire up
 * `onLogin` without any DOM querying. Captcha text/refresh is stubbed via
 * props so a real captcha service can be dropped in later.
 */
function LoginCard({ assets, captchaText, onRefreshCaptcha, onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onLogin?.({ userId, password, captchaInput });
  }

  return (
    <section className={styles.loginCard}>
      <div
        className={styles.loginHeaderBanner}
        style={{ backgroundImage: `url(${assets.loginBanner})` }}
      >
        <h2>LOGIN</h2>
      </div>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Icons.User />
          <input
            type="text"
            name="txtuseridothers"
            id="txtuseridothers"
            placeholder="Enter User ID"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className={styles.inputWrapper}>
          <Icons.Lock />
          <input
            type="password"
            name="TxtPWD"
            id="TxtPWD"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.captchaContainer}>
          <div className={styles.captchaBox}>
            <span>{captchaText}</span>
            <button
              type="button"
              className={styles.captchaRefreshBtn}
              title="Refresh Captcha"
              onClick={onRefreshCaptcha}
            >
              &#8635;
            </button>
          </div>
          <input
            type="text"
            className={styles.captchaInput}
            name="txtcapcha"
            id="txtcapcha"
            placeholder="Enter captcha"
            required
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.submitBtn} id="btnLogin">
          Login
        </button>
      </form>

      <a href={CONTENT.forgotPasswordHref} className={styles.forgotLink} id="anchorforgetpassword">
        Forgot Password?
      </a>
    </section>
  );
}

function AboutColumn({ assets }) {
  return (
    <section className={styles.rightColumn}>
      <p>
        <strong>&apos;Sahyog&apos; Portal</strong> {CONTENT.aboutParagraph}
      </p>

      <div className={styles.shieldWrapper}>
        <img src={assets.shield} alt="Shield Logo" className={styles.shieldImg} />
      </div>
    </section>
  );
}

/**
 * ---------------------------------------------------------------------------
 * SahyogPortal
 * ---------------------------------------------------------------------------
 * @param {Object}   [props.assets]         Override any of the default image paths
 *                                           (e.g. imported assets from your bundler).
 * @param {string}   [props.captchaText]     Current captcha display text.
 * @param {Function} [props.onRefreshCaptcha] Called when the refresh icon is clicked.
 * @param {Function} [props.onLogin]         Called with {userId, password, captchaInput}
 *                                           on form submit.
 */
export default function SahyogPortal({
  assets = {},
  captchaText = "p56CZG",
  onRefreshCaptcha,
  onLogin,
}) {
  const mergedAssets = { ...DEFAULT_ASSETS, ...assets };

  return (
    <div className={styles.wrapper}>
      <TopHeader />
      <BrandHeader assets={mergedAssets} />

      <main className={styles.mainContainer}>
        <VisionMissionColumn />
        <LoginCard
          assets={mergedAssets}
          captchaText={captchaText}
          onRefreshCaptcha={onRefreshCaptcha}
          onLogin={onLogin}
        />
        <AboutColumn assets={mergedAssets} />
      </main>

      <footer className={styles.footerStrip} />
    </div>
  );
}
