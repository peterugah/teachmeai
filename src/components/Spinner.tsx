interface Props {
	size: number;
	lightColor: string;
	darkColor: string;
}
export default function Spinner({
	size = 6,
	lightColor = "gray-500",
	darkColor = "",
}: Props) {
	return (
		<div
			className={`animate-spin rounded-full border-4 border-t-transparent border-${lightColor}
      dark:border-${darkColor}
       h-${size} w-${size}`}
		/>
	);
}
