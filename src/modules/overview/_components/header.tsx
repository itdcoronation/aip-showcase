import useUserStore from "@/store/user";

const Header = () => {
  const { basic_info } = useUserStore();

  // Get current time and determine greeting
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 0 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Format first name to sentence case
  const formatFirstName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const greeting = getTimeBasedGreeting();
  const firstName = formatFirstName(basic_info?.first_name || "");

  return (
    <header className="mb-8" >
      <h1 className="text-p1 font-semibold mb-2">
        {greeting}👋🏾, {firstName}
      </h1>
      <p className="text-p4" >Cheers to growth and gains</p>
    </header>
  );
};

export { Header };
