import { cn } from "@/lib/utils";

const historyItems = [
  {
    date: "Ayer",
    items: [
      "Lorem ipsum dolor sit amet consectetur. Praesent [...]",
      "Lorem ipsum dolor sit amet consectetur. Praesent [...]",
      "Lorem ipsum dolor sit amet consectetur. Praesent [...]",
    ],
  },
  {
    date: "30 días anteriores",
    items: [
      "Lorem ipsum dolor sit amet consectetur. Praesent [...]",
      "Lorem ipsum dolor sit amet consectetur. Praesent [...]",
      "Lorem ipsum dolor sit amet consectetur. Praesent [...]",
    ],
  },
];

export function HistoryPanel() {
  return (
    <div className="w-80 bg-domoblock-panel min-h-screen p-6">
      <h2 className="text-xl font-semibold mb-6">Historial</h2>
      <div className="space-y-6">
        {historyItems.map((section) => (
          <div key={section.date}>
            <h3 className="text-domoblock-accent mb-4">{section.date}</h3>
            <div className="space-y-4">
              {section.items.map((item, index) => (
                <p key={index} className="text-sm text-gray-400">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}