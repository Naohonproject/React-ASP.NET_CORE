import Header from "./Header";
import Main from "./Main";
import CustomModal from "./Modals/Modal";

function Home() {
  return (
    <div className="home">
      <Header />
      <CustomModal name="url" heading="Change Url" />
      <CustomModal name="password" heading="Set Password" />
      <CustomModal name="share" heading="Share" />
      <Main />
    </div>
  );
}

export default Home;
