import { useState } from "react";
import AddModal from "../../components/sections/AddModal";
import Card from "../../components/shared/Card";
import { MdAddCircle } from "react-icons/md";

export default function Masters() {
  const availCollections = [
    { name: "About Me", route: "about" },
    { name: "Experience", route: "experience" },
    { name: "Education", route: "education" },
    { name: "Skills", route: "skills" },
    { name: "Custom", route: "custom" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const handleModalClose = () => {
    console.log("close");
    setIsOpen(false);
  };

  const handleDelete = () => {
    console.log("record delete");
    // setIsOpen(false);
  };
  return (
    <>
      <div className="max-w-full sm:text-center">
        <div className="flex justify-between items-center">
          <div className="self-center mx-auto">
            <h2 className="md:text-5xl text-3xl font-semibold tracking-tight">
              Choose Collection
            </h2>
            <div className="flex justify-center">
              <p className=" mt-6 text-xl/8 font-medium text-gray-500 ">
                Select the collection which you want to modify.
              </p>
            </div>
          </div>
          <button
            className="mr-5 bg-primary px-5 py-3 text-center rounded-lg text-white flex gap-2 items-center"
            onClick={() => setIsOpen(true)}
          >
            <MdAddCircle />
            <span>Add</span>
          </button>
        </div>
      </div>
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
