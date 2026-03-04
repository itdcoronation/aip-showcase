import { EmptyStateSvg } from "@/assets/vectors";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const TransactionHistory = () => {
  const transactions: TransactionItemDto[] = [
    {
      id: "1",
      title: "Withdrawal approved",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "withdrawal",
    },
    {
      id: "2",
      title: "Brokerage account funded",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "deposit",
    },
    {
      id: "3",
      title: "Withdrawal approved",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "withdrawal",
    },
    {
      id: "4",
      title: "Brokerage account funded",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "deposit",
    },
    {
      id: "5",
      title: "Withdrawal approved",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "withdrawal",
    },
    {
      id: "6",
      title: "Brokerage account funded",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "deposit",
    },
    {
      id: "7",
      title: "Withdrawal approved",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "withdrawal",
    },
    {
      id: "8",
      title: "Brokerage account funded",
      description: "Insert the description",
      date: "24 Jun, 2025",
      type: "deposit",
    },
  ];

  return (
    <>
      <aside className="lg:absolute right-0 top-0 lg:w-[27dvw] bg-white border-l border-stroke-primary sm:min-h-dvh h-full overflow-auto hide-scrollbar mt-4 lg:mt-0">
        <div className="p-4 border-b border-stroke-primary flex justify-between items-center">
          <h2 className="text-p1 sm:text-h4 text-txt-primary font-semibold">
            Transaction history
          </h2>
        </div>
        {transactions.length > 0 ? (
          <Transactions transactions={transactions} />
        ) : (
          <EmptyTransactions />
        )}
      </aside>
    </>
  );
};
export { TransactionHistory };

const EmptyTransactions = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">Still empty here</p>
      <p className="text-l3 text-txt-secondary">
        You are yet to carry out any transaction
      </p>
    </div>
  );
};

const Transactions = ({
  transactions,
}: {
  transactions: TransactionItemDto[];
}) => {
  return (
    <section className="p-4">
      {transactions.map((txn) => (
        <TransactionItem key={txn.id} {...txn} />
      ))}
    </section>
  );
};

interface TransactionItemDto {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "deposit" | "withdrawal";
}
const TransactionItem = ({
  date,
  description,
  title,
  type,
}: TransactionItemDto) => {
  return (
    <div className="flex gap-2 border-b border-stroke-primary py-4">
      <div
        className={cn(
          "flex justify-center items-center w-[40px] h-[40px] rounded-full",
          type === "withdrawal"
            ? "bg-icon-danger-light rounded-full text-icon-danger"
            : "bg-icon-success-light rounded-full text-icon-success"
        )}
      >
        {type === "deposit" ? (
          <ArrowDownRight color="currentColor" strokeWidth={1.5} />
        ) : (
          <ArrowUpRight color="currentColor" strokeWidth={1.5} />
        )}
      </div>
      <div>
        <p className="text-p3 font-medium text-txt-primary mb-1">{title}</p>
        <p className="text-p4 text-txt-secondary">{description}</p>
      </div>
      <p className="ml-auto text-txt-primary text-p4">{date}</p>
    </div>
  );
};
