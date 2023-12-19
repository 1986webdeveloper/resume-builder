import { useState } from "react";
import AddModal from "../../components/sections/AddModal";
import Card from "../../components/shared/Card";
import Header from "../../components/shared/Header";
import Breadcrumb from "../../components/shared/Breadcrumb";

export default function Masters() {
  const availCollections = [
    { name: "About Me", route: "about" },
    { name: "Experience", route: "experience" },
    { name: "Education", route: "education" },
    { name: "Skills", route: "skills" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const handleModalClose = () => {
    console.log("close");
    setIsOpen(false);
  };

  const handleDelete = () => {
    console.log("record delete");
  };

  const handleOpenAddModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Header
        handleOpenAddModal={handleOpenAddModal}
        title="Choose Collection"
        description="Select the collection which you want to modify."
      />
      <Breadcrumb />
      {isOpen && (
        <AddModal
          handleModalClose={handleModalClose}
          handleDelete={handleDelete}
        />
      )}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grikd-cols-2 gap-6 mt-16">
        {availCollections.map((collection, index) => (
          <Card
            key={index}
            title={collection.name}
            description="We've designed and built ecommerce experiences that have
                driven sales."
            route={collection.route}
          />
        ))}
      </div>
    </>
  );
}
