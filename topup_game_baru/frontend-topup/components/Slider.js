import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Bisa 3 card per slide
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const games = [
    { id: 1, name: "Mobile Legends", image: "/images/mlbb.jpg" },
    { id: 2, name: "Free Fire", image: "/images/freefire.jpg" },
    { id: 3, name: "Genshin Impact", image: "/images/genshin.jpg" },
    { id: 4, name: "PUBG Mobile", image: "/images/pubg.jpg" },
    { id: 5, name: "Valorant", image: "/images/valorant.jpg" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-5">
      <Slider {...settings}>
        {games.map((game) => (
          <div key={game.id} className="p-2">
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
