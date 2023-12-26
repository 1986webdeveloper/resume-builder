import Card from "../../components/shared/Card";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";

export default function Masters() {
  const availCollections = [
    { name: "About Me", route: "about" },
    { name: "Experience", route: "experience" },
    { name: "Education", route: "education" },
    { name: "Skills", route: "skills" },
  ];

  return (
    <>
      <div className="w-full mt-3 relative">
        <h1 className="font-bold text-3xl text-center">Choose Collection</h1>
      </div>
      <div className="mt-2">
        <CustomBreadcrumb />
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grikd-cols-2 gap-6 mt-16">
        {availCollections.map((collection, index) => (
          <Card
            key={index}
            title={collection.name}
            description="We've designed and built ecommerce experiences that have
                driven sales."
            route={collection.route}
            isDeletable={false}
            isEditable={false}
          />
        ))}
      </div>
    </>
  );
}
