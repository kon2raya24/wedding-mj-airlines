import {
  ItineraryIcon,
  PinIcon,
  UsersIcon,
  GiftIcon,
  CameraIcon,
} from "@/components/Decor";

const items = [
  {
    href: "#schedule",
    icon: ItineraryIcon,
    title: "Flight Itinerary",
    desc: "View the schedule of our special day.",
  },
  {
    href: "#details",
    icon: PinIcon,
    title: "Destination",
    desc: "Venue and map details.",
  },
  {
    href: "#party",
    icon: UsersIcon,
    title: "Entourage",
    desc: "Meet our amazing crew.",
  },
  {
    href: "#registry",
    icon: GiftIcon,
    title: "Registry",
    desc: "Your presence is our greatest gift.",
  },
  {
    href: "#gallery",
    icon: CameraIcon,
    title: "Gallery",
    desc: "Snapshots of our journey.",
  },
];

export default function QuickLinks() {
  return (
    <div className="glass rounded-md overflow-hidden">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-cream/10">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className="group block px-5 py-6 text-center hover:bg-white/5 transition-colors h-full"
              >
                <div className="font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60 mb-3 group-hover:text-silver transition-colors">
                  Gate A{i + 1}
                </div>
                <Icon className="w-9 h-9 mx-auto text-cream/85 group-hover:text-silver group-hover:-translate-y-1 transition-[color,transform] duration-300 ease-out-expo" />
                <div className="mt-3 font-sans uppercase tracking-[0.25em] text-[11px] text-cream">
                  {item.title}
                </div>
                <p className="mt-2 font-serif text-[13px] text-cream/60 leading-snug">
                  {item.desc}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
