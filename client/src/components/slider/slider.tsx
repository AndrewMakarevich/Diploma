import sliderStyles from "./slider.module.css";

const Slider = () => {
  const link = "https://i.ibb.co/k4syyY4/s5ge-Gdu7-Whc.jpg"
  const header = ["Share", "Explore", "Inspire"]
  return (
    <article className={sliderStyles["slider"]}>
      <div>
        {
          header.map(word => (
            <p key={word}>{word}</p>
          ))
        }
      </div>
      <img alt="slider" src={link}></img>
    </article>
  );
}

export default Slider;