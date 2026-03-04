interface FormHeaderProps {
  title: string;
  description: string;
  titleType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  titleClassName?: string;
}

const FormHeader = ({
  title,
  description,
  titleType = "h2",
  titleClassName,
}: FormHeaderProps) => {
  const TitleTag = titleType; // Dynamically set the title tag

  return (
    <div>
      <TitleTag
        className={`text-p1 md:text-h3 font-semibold mb-2 text-txt-primary ${titleClassName}`}
      >
        {title}
      </TitleTag>
      <p className="text-p3 font-medium mb-6 md:mb-10 text-txt-secondary">
        {description}
      </p>
    </div>
  );
};

export { FormHeader };
