import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TooltipProvider } from "#/components/ui/tooltip";
import appCss from "../styles.css?url";

const SITE_URL = "https://unn-result-generator.vercel.app";
const SITE_NAME = "UNN Result Generator";
const SITE_DESCRIPTION =
	"Generate formatted university result sheets in seconds. Upload your CSV or Excel marks, and download a polished DOCX result document — free, fast, and offline.";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

const JSON_LD = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: SITE_NAME,
	url: SITE_URL,
	description: SITE_DESCRIPTION,
	applicationCategory: "EducationalApplication",
	operatingSystem: "Any (Web Browser)",
	featureList: [
		"Upload CSV or Excel result sheets",
		"Auto-calculate totals and grades",
		"Generate formatted DOCX result documents",
		"Customisable DOCX templates",
		"Page sectionalisation with grade summaries",
	],
	browserRequirements: "Requires a modern web browser with JavaScript enabled",
	softwareVersion: "1.0",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "NGN",
	},
});

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: SITE_NAME },
			{ name: "description", content: SITE_DESCRIPTION },
			{ name: "theme-color", content: "#0d9488" },
			{ name: "robots", content: "index, follow" },
			{ name: "author", content: "UNN Result Generator" },

			// Open Graph
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:title", content: SITE_NAME },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:image", content: `${SITE_URL}/og.png` },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:site_name", content: SITE_NAME },

			// Twitter Card
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: SITE_NAME },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{ name: "twitter:image", content: `${SITE_URL}/og.png` },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "canonical", href: SITE_URL },
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{ rel: "icon", href: "/logo192.png", type: "image/png", sizes: "192x192" },
			{ rel: "apple-touch-icon", href: "/logo192.png" },
			{ rel: "manifest", href: "/manifest.json" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON_LD }}
				/>
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				<TooltipProvider>
					{children}
					<TanStackDevtools
						config={{ position: "bottom-right" }}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				</TooltipProvider>
				<Scripts />
			</body>
		</html>
	);
}
