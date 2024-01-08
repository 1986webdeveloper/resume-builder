interface propType {
  name: string;
}

export default function Badge({ name }: propType) {
  return (
    <span className="bg-green-100 text-green-800 text-xs capitalize  font-medium me-2 px-2.5 py-2 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
      {name}
    </span>
  );
}
