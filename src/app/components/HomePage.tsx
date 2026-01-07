import { Gift, MapPin } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: "gifts" | "places") => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1
          className="text-6xl sm:text-7xl md:text-9xl mb-4 text-[#3D3328]"
          style={{ fontFamily: "DarumadropOne, serif" }}
        >
          Benha's Wishlist
        </h1>
      </div>

      {/* Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-6xl group/cards">
        {/* Gifts Card */}
        <button
          onClick={() => onNavigate("gifts")}
          className="group card-item relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_8px_30px_rgba(217,118,82,0.12)] hover:shadow-[0_12px_40px_rgba(217,118,82,0.2)] transition-all duration-500 h-[400px] sm:h-[500px] group-hover/cards:opacity-40 hover:!opacity-100"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1667869285880-4097f8b153d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwd3JhcHBlZCUyMGJveHxlbnwxfHx8fDE3Njc2MzY3NTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Beautifully wrapped gifts"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3328]/90 via-[#3D3328]/40 to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-end p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#7C8B6E] flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h2
                className="text-3xl sm:text-4xl text-[#E4F1D7]"
                style={{ fontFamily: "DarumadropOne, serif" }}
              >
                Presents
              </h2>
            </div>
          </div>
        </button>

        {/* Places Card */}
        <button
          onClick={() => onNavigate("places")}
          className="group card-item relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_8px_30px_rgba(124,139,110,0.12)] hover:shadow-[0_12px_40px_rgba(124,139,110,0.2)] transition-all duration-500 h-[400px] sm:h-[500px] group-hover/cards:opacity-40 hover:!opacity-100"
        >
          <div className="absolute inset-0">
            <img
              src="https://benha-wishlist.s3.ap-southeast-2.amazonaws.com/Tokyo-Node-Cafe.jpg"
              alt="Scenic mountain landscape"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3328]/90 via-[#3D3328]/40 to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-end p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#7C8B6E] flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2
                className="text-3xl sm:text-4xl text-[#E4F1D7]"
                style={{ fontFamily: "DarumadropOne, serif" }}
              >
                Locations
              </h2>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}