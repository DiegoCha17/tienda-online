import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "Mis Favoritos | Mi Tienda",
  description: "Tus productos favoritos guardados.",
};

export default function WishlistPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="pb-12">
        <WishlistClient />
      </div>
    </div>
  );
}
