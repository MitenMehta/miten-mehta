import { cn } from "@/lib/utils";

const timeframes = [
  { label: "1 year", period: "CY23-24", indiaRank: "4th" },
  { label: "3 years", period: "CY21-24", indiaRank: "3rd" },
  { label: "5 years", period: "CY19-24", indiaRank: "3rd" },
  { label: "10 years", period: "CY14-24", indiaRank: "3rd" },
  { label: "20 years", period: "CY04-24", indiaRank: "1st" },
];

const rankings = {
  "1 year": [
    { country: "Taiwan", return: "34%" },
    { country: "USA", return: "25%" },
    { country: "China", return: "19%" },
    { country: "India", return: "11%" },
    { country: "Germany", return: "10%" },
    { country: "UK", return: "9%" },
    { country: "Japan", return: "8%" },
    { country: "MSCI EM", return: "7%" },
    { country: "France", return: "-5%" },
    { country: "S.Korea", return: "-23%" },
    { country: "Brazil", return: "-29%" },
  ],
  "3 years": [
    { country: "USA", return: "8%" },
    { country: "UK", return: "8%" },
    { country: "India", return: "7%" },
    { country: "Taiwan", return: "7%" },
    { country: "Japan", return: "3%" },
    { country: "Brazil", return: "2%" },
    { country: "Germany", return: "2%" },
    { country: "France", return: "0%" },
    { country: "MSCI EM", return: "-2%" },
    { country: "China", return: "-6%" },
    { country: "S.Korea", return: "-13%" },
  ],
  "5 years": [
    { country: "Taiwan", return: "17%" },
    { country: "USA", return: "14%" },
    { country: "India", return: "13%" },
    { country: "UK", return: "6%" },
    { country: "Japan", return: "5%" },
    { country: "France", return: "4%" },
    { country: "Germany", return: "4%" },
    { country: "MSCI EM", return: "2%" },
    { country: "S.Korea", return: "-2%" },
    { country: "China", return: "-3%" },
    { country: "Brazil", return: "-7%" },
  ],
  "10 years": [
    { country: "Taiwan", return: "14%" },
    { country: "USA", return: "12%" },
    { country: "India", return: "9%" },
    { country: "France", return: "6%" },
    { country: "Japan", return: "6%" },
    { country: "UK", return: "6%" },
    { country: "Germany", return: "4%" },
    { country: "MSCI EM", return: "4%" },
    { country: "China", return: "2%" },
    { country: "S.Korea", return: "2%" },
    { country: "Brazil", return: "1%" },
  ],
  "20 years": [
    { country: "India", return: "10%" },
    { country: "USA", return: "10%" },
    { country: "Taiwan", return: "10%" },
    { country: "China", return: "7%" },
    { country: "UK", return: "6%" },
    { country: "MSCI EM", return: "6%" },
    { country: "Germany", return: "5%" },
    { country: "Brazil", return: "5%" },
    { country: "S.Korea", return: "5%" },
    { country: "France", return: "5%" },
    { country: "Japan", return: "4%" },
  ],
};

export default function MSCIRankingsTable() {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
      <h3 className="text-2xl md:text-3xl font-bold text-[hsl(215,50%,12%)] mb-2">
        MSCI Country Rankings <span className="text-lg font-normal text-muted-foreground">($)</span>
      </h3>
      <p className="text-muted-foreground mb-6">Dollar-term returns of Indian Indices vs Global Equity Markets</p>
      
      {/* India's Position Row */}
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
        <div className="bg-[hsl(25,95%,53%)] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold text-xs md:text-sm">
          India's Position
        </div>
        {timeframes.map((tf) => (
          <div 
            key={tf.label}
            className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-sm",
              tf.indiaRank === "1st" ? "bg-[hsl(25,95%,53%)]" : "bg-[hsl(215,50%,25%)]"
            )}
          >
            {tf.indiaRank}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-[hsl(215,20%,40%)] text-white">
              {timeframes.map((tf) => (
                <th key={tf.label} className="px-3 py-3 text-center">
                  <div className="font-semibold">{tf.label}</div>
                  <div className="text-xs opacity-80">{tf.period}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 11 }).map((_, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={cn(
                  "border-b border-gray-100",
                  rowIndex % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                )}
              >
                {timeframes.map((tf) => {
                  const data = rankings[tf.label as keyof typeof rankings][rowIndex];
                  const isIndia = data?.country === "India";
                  return (
                    <td key={tf.label} className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={cn(
                          "font-medium",
                          isIndia ? "text-[hsl(0,70%,50%)]" : "text-[hsl(215,50%,20%)]"
                        )}>
                          {data?.country}
                        </span>
                        <span className={cn(
                          "tabular-nums",
                          isIndia ? "text-[hsl(0,70%,50%)] font-semibold" : "text-muted-foreground"
                        )}>
                          {data?.return}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Source: MSCI Country Indices | Returns are CAGR in USD terms
      </p>
    </div>
  );
}