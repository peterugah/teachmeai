export default function Logo({ width = 30, height = 30 }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 64 64"
		>
			<defs>
				<radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
					<stop offset="0%" stopColor="#6833FF" />
					<stop offset="100%" stopColor="#00FFC6" />
				</radialGradient>
			</defs>

			{/* Background */}
			<circle cx="32" cy="32" r="32" fill="url(#bgGrad)" />

			{/* Book */}
			<path d="M16 20 L32 16 L32 48 L16 44 Z" fill="#FFFFFF" />
			<path d="M32 16 L48 20 L48 44 L32 48 Z" fill="#FFFFFF" />

			{/* AI circuits */}
			<line
				x1="32"
				y1="16"
				x2="32"
				y2="8"
				stroke="#FFFFFF"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<circle cx="32" cy="8" r="2" fill="#FFFFFF" />

			<line
				x1="24"
				y1="24"
				x2="18"
				y2="16"
				stroke="#FFFFFF"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<circle cx="18" cy="16" r="2" fill="#FFFFFF" />

			<line
				x1="40"
				y1="24"
				x2="46"
				y2="16"
				stroke="#FFFFFF"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<circle cx="46" cy="16" r="2" fill="#FFFFFF" />
		</svg>
	);
}
