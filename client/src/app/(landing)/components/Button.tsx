import clsx from "clsx";

interface ButtonProps {
  icon?: string; // URL to the icon image, optional
  children: React.ReactNode; // The button text or any content inside the button
  href?: string; // Optional href for the anchor tag
  containerClassName?: string; // Optional className for styling
  onClick?: () => void; // Optional onClick function for the button
}

const Button = ({
  icon,
  children,
  href,
  containerClassName,
  onClick,
}: ButtonProps) => {
  const Inner = () => (
    <>
      <span className="relative flex items-center min-h-[60px] px-4 g1 rounded-2xl inner-before group-hover:before:opacity-100 overflow-hidden">
        {icon && (
          <img
            src={icon}
            alt="circle"
            className="size-10 mr-5 object-contain z-10"
          />
        )}

        <span className="relative z-2 font-poppins base-bold text-s5 uppercase">
          {children}
        </span>
      </span>

      <span className="glow-before glow-after" />
    </>
  );

  return href ? (
    <a
      className={clsx(
        "relative p-0.5 g1 rounded-2xl shadow-100 group",
        containerClassName
      )}
      href={href}
    >
      <Inner />
    </a>
  ) : (
    <button
      className={clsx(
        "relative p-0.5 g1 rounded-2xl shadow-100 group",
        containerClassName
      )}
      onClick={onClick}
    >
      <Inner />
    </button>
  );
};

export default Button;
