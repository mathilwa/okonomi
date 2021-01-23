// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import * as XLSX from 'xlsx';
import {addDays} from 'date-fns';

interface Transaction {
    amount: number;
    bookDate: Date;
    currency: string;
    area: string;
    category: string;
    description: string;
    transactionDate: Date;
    type: string;
}

const App: React.FC = ()=> {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();

            if (event.target.files) {
                const newDocumentsToUpload = Array.from(event.target.files);

                const f = newDocumentsToUpload[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    if (e && e.target && e.target.result) {
                        var data = new Uint8Array(e.target.result as ArrayBufferLike);
                        var workbook = XLSX.read(data, {type: 'array'});

                        var sheet_name_list = workbook.SheetNames;

                        const referenceDate = new Date('1899-12-30');
                        const allTranscations = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).map((transaction: any) => ({
                            amount: transaction['Amount'],
                            bookDate: addDays(referenceDate, transaction['BookDate']),
                            currency: transaction['Currency'],
                            area: transaction['Merchant Area'],
                            category: transaction['Merchant Category'],
                            description: transaction['Text'],
                            transactionDate: addDays(referenceDate, transaction['TransactionDate']),
                            type: transaction['Type'],
                        }));


                        setTransactions(allTranscations);
                    }
                };

                reader.readAsArrayBuffer(f);
            }

        };


    console.log(transactions);


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Blir du oppdatert fortsatt?
        </p>

          <div>
              <label>
                  <input type="file" onChange={onUpload} accept="file" />
              </label>
          </div>
      </header>
    </div>
  );
};

export default App;
