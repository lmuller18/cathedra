type Status = "built" | "owned" | "ordered" | "not-owned";

export type Model = {
  name: string;
  image: string;
  status: Status;
  description?: string;
  releaseDate?: string;
  scale: string;
  grade: string;
  series: string;
  accessories?: string[];
};

const GundamCard = ({ model }: { model: Model }) => {
  const {
    name,
    status,
    image,
    series,
    releaseDate,
    scale,
    accessories,
    description,
    grade,
  } = model;

  const statusColors = {
    owned: "bg-yellow-500 border-yellow-500",
    ordered: "bg-blue-500 border-blue-500",
    built: "bg-green-500 border-green-500",
    "not-owned": "bg-gray-500 border-gray-500",
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="h-56 w-full object-cover" src={image} alt={name} />
      <div className={`h-1 w-full ${statusColors[status]}`} />
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">{name}</h2>
          <div>
            <div
              className={`flex items-center whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold capitalize ${statusColors[status]} text-white`}
            >
              {status.replace("-", " ")}
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        <div className="my-4">
          <div className="text-sm">
            <div className="my-1">
              <span className="mr-2 font-bold">Series:</span>
              {series}
            </div>
            <div className="my-1">
              <span className="mr-2 font-bold">Scale:</span>
              {scale} {grade}
            </div>
            <div className="my-1">
              <span className="mr-2 font-bold">Release Date:</span>
              {releaseDate}
            </div>
            <div className="my-1">
              <span className="mr-2 font-bold">Accessories:</span>
              {accessories?.join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GundamCard;
