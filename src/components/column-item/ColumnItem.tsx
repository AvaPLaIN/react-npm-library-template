import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import ColumnMenu from "../column-menu/ColumnMenu";
import { SortType } from "../table/hooks/useOnSort";
import { Column } from "../table/Table";
import { ColumnRefType } from "../table/utils/createColumnRefs";
import ResizeBar from "./ColumnItem.styles";

interface IColumnProps<ColumnType> {
  column: ColumnType;
  renderColumnItem: (item: ColumnType) => React.ReactNode;
  onSort: (column: string, type: string) => void;
  sort: SortType;
  index: number;
  resizable: boolean;
  setActiveIndexOnResize: (index: number) => void;
}

const ColumnItem = <ColumnType extends Column>({
  column,
  renderColumnItem,
  onSort,
  sort,
  index,
  resizable,
  setActiveIndexOnResize,
}: IColumnProps<ColumnType & ColumnRefType>) => {
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [sortCount, setSortCount] = useState(0);

  const columnMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(columnMenuRef, () => {
    setIsColumnMenuOpen(false);
  });

  useEffect(() => {
    const isColumnSorted = sort.isSort && sort.sortBy!.id === column.id;
    if (!isColumnSorted) setSortCount(0);
  }, [column.id, sort]);

  const handleOnSort = (id: string) => {
    let type = "default";
    if (sortCount % 3 === 0) type = "asc";
    if (sortCount % 3 === 1) type = "desc";

    setSortCount((sortCount % 3) + 1);
    onSort(id, type);
  };

  const handleOnMouseDown = (index: number) => {
    setActiveIndexOnResize(index);
  };

  const handleOnClickFilter = () => {
    setIsColumnMenuOpen(true);
  };

  return (
    <th ref={column.ref}>
      <div
        className="info"
        onClick={column.sort ? () => handleOnSort(column.id) : undefined}
      >
        <span>{renderColumnItem(column)}</span>
        {column.sort && (
          <button className="sort">
            {sortCount % 3 === 1 ? "▼" : sortCount % 3 === 2 ? "▲" : ""}
          </button>
        )}
      </div>
      {column.filter && (
        <div className="filter" onClick={handleOnClickFilter}>
          <AiOutlineMenu />
        </div>
      )}
      <ResizeBar
        resizable={resizable}
        onMouseDown={resizable ? () => handleOnMouseDown(index) : undefined}
      />
      <ColumnMenu ref={columnMenuRef} isOpen={isColumnMenuOpen} />
    </th>
  );
};

export default ColumnItem;
