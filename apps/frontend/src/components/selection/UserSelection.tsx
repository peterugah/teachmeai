import Logo from "../Logo";

interface UserSelectionProps {
	onClick: () => void;
}
export function UserSelection({ onClick }: UserSelectionProps) {
	return (
		<button
			onClick={onClick}
			className="fixed cursor-pointer size-7 text-yellow bg-white shadow-md rounded-full flex items-center justify-center dark:text-red"
		>
			<Logo />
		</button>
	);
}
