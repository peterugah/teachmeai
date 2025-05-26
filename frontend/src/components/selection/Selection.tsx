import Logo from "../Logo";

interface SelectionProps {
	onClick: () => void;
}
export function Selection({ onClick }: SelectionProps) {
	return (
		<button
			onClick={onClick}
			className="fixed cursor-pointer size-7 text-yellow bg-white shadow-md rounded-full flex items-center justify-center dark:text-red"
		>
			<Logo />
		</button>
	);
}
