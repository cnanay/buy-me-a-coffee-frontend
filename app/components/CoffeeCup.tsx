type Props = {
  className?: string;
};

/**
 * A friendly coffee cup illustration with gently rising steam.
 * Pure SVG so it scales crisply and needs no image assets.
 */
export function CoffeeCup({ className }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="A steaming cup of coffee"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Steam */}
      <g
        fill="none"
        stroke="#c2925f"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.8"
      >
        <path
          className="steam"
          style={{ animationDelay: '0s' }}
          d="M48 34c-5-5 5-9 0-15"
        />
        <path
          className="steam"
          style={{ animationDelay: '0.6s' }}
          d="M62 30c-5-5 5-9 0-15"
        />
        <path
          className="steam"
          style={{ animationDelay: '1.2s' }}
          d="M76 34c-5-5 5-9 0-15"
        />
      </g>

      {/* Saucer */}
      <ellipse cx="60" cy="104" rx="44" ry="7" fill="#e7c9a4" />

      {/* Cup body */}
      <path
        d="M26 50h60v22c0 16-13 28-30 28S26 88 26 72V50z"
        fill="#8b5e34"
      />
      <path
        d="M26 50h60v8c0 4-13 8-30 8S26 62 26 58v-8z"
        fill="#3c2415"
      />

      {/* Coffee surface */}
      <ellipse cx="56" cy="52" rx="27" ry="6" fill="#5a3a22" />

      {/* Handle */}
      <path
        d="M86 56c14 0 18 8 18 16s-6 16-18 16"
        fill="none"
        stroke="#8b5e34"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
