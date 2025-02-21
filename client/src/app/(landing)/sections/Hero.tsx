// import { Element, Link as LinkScroll } from "react-scroll";
import Button from "../components/Button";

const Hero = () => {
  return (
    <section className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">
      {/* <Element name="hero"> */}
        <div className="container">
          <div className="relative z-2 max-w-512 max-lg:max-w-388">
            <div className="caption small-2 uppercase text-s2">
              Fullfilment by Us
            </div>
            <h1 className="mb-6 h1 text-p7 uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
              From Storage to Shipment 
            </h1>
            <p className="max-w-440 mb-14 body-1 max-md:mb-10">
              A Team of experienced tourism professionals will provide you with the best advice and tips for your desire place. 
            </p>
            {/* <LinkScroll to="features" offset={-100} spy smooth> */}
              <Button icon="/images/zap.svg">Try it now</Button>
            {/* </LinkScroll> */}
          </div>

          <div className="absolute top-1 left-[calc(50%-90px)] w-[960px] pointer-events-none hero-img_res">
            <img
              src="/images/hero.png"
              className="size-960 max-lg:h-auto"
              alt="hero"
            />
          </div>
        </div>
      {/* </Element> */}
    </section>
  );
};

export default Hero;
