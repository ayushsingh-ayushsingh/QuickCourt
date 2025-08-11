import NavbarWrapper from "@/components/layouts/navbar-wrapper";
import Footer from "@/components/layouts/footer";
import Main from "@/components/layouts/main";

export default async function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <NavbarWrapper />
      <Main />
      <Footer />
    </div>
  );
}
