import { useEffect, useState } from "react";
import Card from "../../components/shared/Card";
import { useParams } from "react-router-dom";
import { getDesignations } from "../../services/masters/getDesignations";
import { MdAddCircle } from "react-icons/md";
import AddModal from "../../components/sections/AddModal";

export default function Designations() {
  const availableDesignations = [
    { name: "Java", route: "java" },
    { name: "React", route: "react" },
    { name: "Node", route: "node" },
    { name: "Php", route: "php" },
    { name: "Next", route: "next" },
    { name: "Python", route: "python" },
  ];
  const { collection } = useParams();
  console.log(collection);
  const token = localStorage.getItem("token");
  useEffect(() => {
    getDesignations(token).then((res) => console.log(res));
  }, [collection]);
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
              Choose Designation
            </h2>
            <div className="flex justify-center">
              <p className=" mt-6 text-xl/8 font-medium text-gray-500 ">
                Select the designation which you want to modify.
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
        {availableDesignations.map((designation, index) => (
          <Card
            key={index}
            title={designation.name}
            description="We've designed and built ecommerce experiences that have
                driven sales."
            route={designation.route}
          />
        ))}
      </div>
    </>
  );
}
