import { addDays } from 'date-fns';
import groupBy from 'lodash.groupby';
import React, { ChangeEvent, useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import transactions from './transactions';

// interface Transaction {
//     amount: number;
//     bookDate: Date;
//     currency: string;
//     area: string;
//     category: string;
//     description: string;
//     transactionDate: Date;
//     type: string;
// }

const App: React.FC = () => {
    // const [transactions, setTransactions] = useState<Transaction[]>([]);

    // const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    //     event.preventDefault();
    //
    //     if (event.target.files) {
    //         const newDocumentsToUpload = Array.from(event.target.files);
    //
    //         const f = newDocumentsToUpload[0];
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             if (e && e.target && e.target.result) {
    //                 const data = new Uint8Array(e.target.result as ArrayBufferLike);
    //                 const workbook = XLSX.read(data, { type: 'array' });
    //
    //                 const sheetNameList = workbook.SheetNames;
    //
    //                 const referenceDate = new Date('1899-12-30');
    //                 const allTranscations = XLSX.utils
    //                     .sheet_to_json(workbook.Sheets[sheetNameList[0]])
    //                     .map((transaction: any) => ({
    //                         amount: transaction.Amount,
    //                         bookDate: addDays(referenceDate, transaction.BookDate),
    //                         currency: transaction.Currency,
    //                         area: transaction['Merchant Area'],
    //                         category: transaction['Merchant Category'],
    //                         description: transaction.Text,
    //                         transactionDate: addDays(referenceDate, transaction.TransactionDate),
    //                         type: transaction.Type,
    //                     }));
    //
    //                 const fileData = JSON.stringify(allTranscations);
    //                 const blob = new Blob([fileData], { type: 'text/plain' });
    //                 const url = URL.createObjectURL(blob);
    //                 const link = document.createElement('a');
    //                 link.download = 'filename.json';
    //                 link.href = url;
    //                 link.click();
    //
    //                 setTransactions(allTranscations);
    //             }
    //         };
    //
    //         reader.readAsArrayBuffer(f);
    //     }
    // };

    const transactionsGroupedByCategory = groupBy(transactions, 'category');
    const transactionsWithTotalAmountForCategory: Record<
        string,
        { totalAmount: number; count: number }
    > = Object.keys(transactionsGroupedByCategory).reduce((allTransactions, key) => {
        const transactionsForCategory = transactionsGroupedByCategory[key];
        const totalAmountForCategory = transactionsForCategory.reduce(
            (amount, transaction) => amount + transaction.amount,
            0
        );

        return {
            ...allTransactions,
            [key]: { totalAmount: totalAmountForCategory, count: transactionsForCategory.length },
        };
    }, {});

    const totalAmount = Object.keys(transactionsWithTotalAmountForCategory).reduce((total, transaction) => {
        const amount = transactionsWithTotalAmountForCategory[transaction].totalAmount;
        if (amount < 0) {
            return total + transactionsWithTotalAmountForCategory[transaction].totalAmount;
        }

        return total;
    }, 0);

    return (
        <div className="App">
            <header className="App-header">
                <p>Blir du oppdatert fortsatt?</p>

                <h1>{totalAmount}</h1>

                <ul>
                    {Object.keys(transactionsWithTotalAmountForCategory).map((transaction, index) => (
                        <li key={index}>
                            <span>
                                {transaction}[{transactionsWithTotalAmountForCategory[transaction].count}]
                            </span>
                            :<span>{transactionsWithTotalAmountForCategory[transaction].totalAmount}</span>
                        </li>
                    ))}
                </ul>
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            <span>{transaction.description}</span>:<span>{transaction.amount}</span>
                        </li>
                    ))}
                </ul>
            </header>
        </div>
    );
};

export default App;
