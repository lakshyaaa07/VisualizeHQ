import { Element } from "react-scroll";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.js";

const Hero = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleTryItNow = () => {
    navigate("/upload"); // Navigate to the /upload route
  };

  return (
    <section className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">
      <Element name="hero">
        <div className="container">
          <div className="relative z-2 max-w-512 max-lg:max-w-388">
            <div className="caption small-2 uppercase text-p3">
              Data Analytics & Visualization
            </div>
            <h1 className="mb-6 h1 text-p4 uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
              Unlock Insights from Your Data
            </h1>
            <p className="max-w-440 mb-14 body-1 max-md:mb-10">
              Vizora is your go-to platform for easy, powerful data
              analysis and visualization. Upload your data, gain actionable
              insights, and make smarter business decisions effortlessly.
            </p>
            <Button icon="/images/zap.svg" onClick={handleTryItNow}>
              Try it now
            </Button>
          </div>

          <div className="absolute -top-32 left-[calc(50%-340px)] w-[1230px] pointer-events-none hero-img_res">
            <img
              src="/images/hero.png"
              className="size-1230 max-lg:h-auto"
              alt="hero"
            />
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Hero;
