import NavbarWrapper from "@/components/layouts/navbar-wrapper";
import Footer from "@/components/layouts/footer";
import Main from "@/components/layouts/main";

export default async function Home() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <NavbarWrapper />
      </div>
      <div className="border-b w-full" />
      <div className="max-w-7xl mx-auto">
        <Main />
        <Footer />
      </div>
    </div>
  );
}
