import { ReactNode } from "react";

type Itxn = {
    date: string,
    amount: number,
    type?: string,
    status: string,
}

interface BadgeProps {
  variant: "secondary" | "outline";
  children: ReactNode;
}


const Badge = ({ variant, children }: BadgeProps) => {
  const baseStyle = "px-2 py-1 rounded-full text-xs font-medium";
  const styles = {
    secondary: "bg-gray-200 text-gray-800",
    outline: "border border-gray-300 text-gray-800",
  };

  return <span className={`${baseStyle} ${styles[variant]}`}>{children}</span>;
};

export default function Transactions(transaction: Itxn){
    return (
      <tbody>
        <tr className="text-center">
          <td className="px-4 py-2 border-b">{transaction.date}</td>
          <td className="px-4 py-2 border-b">₹ {transaction.amount / 100}</td>
          <td className="px-4 py-2 border-b">Add Money</td>
          <td className="px-4 py-2 border-b">
            <Badge
              variant={
                transaction.status === "Completed" ? "secondary" : "outline"
              }
            >
              {transaction.status}
            </Badge>
          </td>
        </tr>
      </tbody>
    );
}