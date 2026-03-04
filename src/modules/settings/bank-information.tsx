"use client";

import { EmptyStateSvg } from "@/assets/vectors";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankAccountTable } from "@/components/tables/bank-account-table";
import { getBankAccountTableColumns } from "@/components/tables/bank-account-table/columns";
import { BankAccountTableData, CardsTableData } from "@/types/bank-info";
import { CardsTable } from "@/components/tables/cards-table";
import { getCardsTableColumns } from "@/components/tables/cards-table/columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddCardModal } from "@/components/modals/add-card";
import { AddBankAccountModal } from "@/components/modals/add-bank-account";

const bankAccountTableData: BankAccountTableData[] = [
  {
    id: "1",
    account_name: "Philip Olorunfemi Ofei",
    account_number: "1234567890",
    bank: "GTBank",
    date_added: "24 Apr, 2025",
  },
  {
    id: "2",
    account_name: "Trust & Will",
    account_number: "1234567890",
    bank: "Access Bank",
    date_added: "24 Apr, 2025",
  },
  {
    id: "3",
    account_name: "Trust & Will",
    account_number: "1234567890",
    bank: "Zenith Bank",
    date_added: "24 Apr, 2025",
  },
  {
    id: "4",
    account_name: "Trust & Will",
    account_number: "1234567890",
    bank: "First Bank",
    date_added: "24 Apr, 2025",
  },
  {
    id: "5",
    account_name: "Trust & Will",
    account_number: "1234567890",
    bank: "UBA",
    date_added: "24 Apr, 2025",
  },
];

const cardsTableData: CardsTableData[] = [
  {
    id: "1",
    card_number: "xxxx 3456",
    card_type: "Visa",
    account_name: "Philip Olorunfemi Ofei",
    bank: "GTBank",
    date_added: "24 Apr, 2025",
    expiration_date: "12 Jul, 2025",
  },
  {
    id: "2",
    card_number: "xxxx 4567",
    card_type: "Mastercard",
    account_name: "Trust & Will",
    bank: "Access Bank",
    date_added: "24 Apr, 2025",
    expiration_date: "12 Jul, 2025",
  },
  {
    id: "3",
    card_number: "xxxx 5678",
    card_type: "Visa",
    account_name: "Trust & Will",
    bank: "Zenith Bank",
    date_added: "24 Apr, 2025",
    expiration_date: "12 Jul, 2025",
  },
  {
    id: "4",
    card_number: "xxxx 6789",
    card_type: "Visa",
    account_name: "Trust & Will",
    bank: "First Bank",
    date_added: "24 Apr, 2025",
    expiration_date: "12 Jul, 2025",
  },
  {
    id: "5",
    card_number: "xxxx 7890",
    card_type: "Mastercard",
    account_name: "Trust & Will",
    bank: "UBA",
    date_added: "24 Apr, 2025",
    expiration_date: "12 Jul, 2025",
  },
];

const BankInformationUI = () => {
  const cardsColumns = getCardsTableColumns({
    handleRemove: (id) => console.log("remove", id),
  });
  const bankAccountsColumns = getBankAccountTableColumns({
    handleRemove: (id) => console.log("remove", id),
  });

  const [addCard, setAddCard] = useState(false);
  const [addBank, setAddBank] = useState(false);

  return (
    <>
      <AddCardModal
        show={addCard}
        close={() => setAddCard(false)}
        handleContinue={() => setAddCard(false)}
      />
      <AddBankAccountModal
        show={addBank}
        close={() => setAddBank(false)}
        handleContinue={() => setAddBank(false)}
      />
      <section className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] rounded-[12px] py-6 px-4">
        <Tabs defaultValue="bank_accounts">
          <TabsList className="mb-4">
            <TabsTrigger value="bank_accounts">Bank account</TabsTrigger>
            <TabsTrigger value="cards">ATM cards</TabsTrigger>
          </TabsList>
          <TabsContent value="bank_accounts">
            {bankAccountTableData.length > 0 ? (
              <BankAccountTable
                columns={bankAccountsColumns}
                data={bankAccountTableData}
              />
            ) : (
              <EmptyAssets
                title={"You have no bank accounts"}
                description={""}
              />
            )}
            <Button
              onClick={() => setAddBank(true)}
              size={"xs"}
              className="mt-6"
            >
              Add account <PlusCircle />
            </Button>
          </TabsContent>
          <TabsContent value="cards">
            {cardsTableData.length > 0 ? (
              <CardsTable columns={cardsColumns} data={cardsTableData} />
            ) : (
              <EmptyAssets title={"You have no cards"} description={""} />
            )}
            <Button
              onClick={() => setAddCard(true)}
              size={"xs"}
              className="mt-6"
            >
              Add card <PlusCircle />
            </Button>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export { BankInformationUI };

const EmptyAssets = ({ title, description }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">{title}</p>
      <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
        {description}
      </p>
    </div>
  );
};
