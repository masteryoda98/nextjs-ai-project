import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // First check if the table exists
    const { data: tableExists, error: tableError } = await supabase.rpc("check_table_exists", {
      table_name: "creatoramp_users",
    })

    if (tableError) {
      // If the RPC doesn't exist, try a direct query
      const { data: tableInfo, error: infoError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "creatoramp_users")

      if (infoError) {
        return NextResponse.json(
          {
            error: "Failed to check if table exists",
            details: infoError.message,
          },
          { status: 500 },
        )
      }

      if (!tableInfo || tableInfo.length === 0) {
        return NextResponse.json({
          exists: false,
          message: "The creatoramp_users table does not exist",
        })
      }
    } else if (!tableExists) {
      return NextResponse.json({
        exists: false,
        message: "The creatoramp_users table does not exist",
      })
    }

    // Table exists, now get column information
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_schema", "public")
      .eq("table_name", "creatoramp_users")

    if (columnsError) {
      // If we can't get schema info, try to get a sample row
      const { data: sampleRow, error: sampleError } = await supabase.from("creatoramp_users").select("*").limit(1)

      if (sampleError) {
        return NextResponse.json(
          {
            error: "Failed to get table structure",
            details: sampleError.message,
          },
          { status: 500 },
        )
      }

      if (sampleRow && sampleRow.length > 0) {
        return NextResponse.json({
          exists: true,
          columns: Object.keys(sampleRow[0]).map((name) => ({
            column_name: name,
            data_type: typeof sampleRow[0][name],
            is_nullable: "UNKNOWN",
          })),
          source: "sample_row",
        })
      } else {
        return NextResponse.json({
          exists: true,
          message: "Table exists but is empty and schema info is not accessible",
          source: "empty_table",
        })
      }
    }

    return NextResponse.json({
      exists: true,
      columns,
      source: "schema_info",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
