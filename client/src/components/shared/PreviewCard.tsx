interface propType {
  children: any;
}

export default function PreviewCard({ children }: propType) {
  return (
    <div className="relative px-4 py-3 dark:bg-gray-900 dark:text-gray-100 fadeIn  shadow-xl rounded-lg border text-sm transition-all duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-2xl hover:scale-105 font-serif">
      {children}
    </div>
  );
}
