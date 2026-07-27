import type {
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes
} from "react";
import { EmptyState } from "./feedback";

export function Table({ children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="ui-table-wrap">
      <table className="ui-table" {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

export function TableHeaderCell({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope="col" {...props}>{children}</th>;
}

export function TableCell({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props}>{children}</td>;
}

export function TableEmpty({ columns, title, description }: { columns: number; title: string; description: string }) {
  return (
    <tbody>
      <tr>
        <td colSpan={columns}>
          <EmptyState title={title} description={description} />
        </td>
      </tr>
    </tbody>
  );
}
