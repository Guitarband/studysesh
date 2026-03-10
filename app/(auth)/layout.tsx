import { requireUnAuth } from "@/lib/auth-utils";

const Layout = async ({ children } : { children: React.ReactNode}) => {
	await requireUnAuth()

	return (
		<div className="w-full h-screen flex flex-row items-center justify-center bg-[#8CB369]">
			<div className="flex-2 h-full p-0">	
				{children}
			</div>
			<div className="flex-3 h-full">
				<span>Stuffs</span>
			</div>
		</div>
	)
}

export default Layout;