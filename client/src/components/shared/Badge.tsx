interface propType {
  name: string;
}

export default function Badge({ name }: propType) {
  return (
    <span className="bg-gray-200 text-gray-800 text-sm capitalize font-bold text-center me-2 px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
      {name}
    </span>
  );
}
