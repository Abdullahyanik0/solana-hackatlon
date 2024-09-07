import React from "react";
import { ScrollArea, Table } from "@mantine/core";
import Loading from "@/components/Loading";


const CustomTable = ({ cols, rows, loading }) => {
  return (
   /*  */ <ScrollArea className=" rounded-xl  border-[1px] p-2">
      <Table striped highlightOnHover sx={{ minWidth: 800 }} verticalSpacing="sm">
          <Table.tr>
            {cols?.map((item, i) => (
              <Table.th key={i}>{item}</Table.th>
            ))}
          </Table.tr>
        <tbody>{rows}</tbody>
      </Table>
      {loading && (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      )}
      {(rows?.length === 0 || rows?.length === undefined) && !loading && <div className="flex justify-center items-center flex-col ">Not found</div>}
    </ScrollArea>
  );
};

export default CustomTable;
