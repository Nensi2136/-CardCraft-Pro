using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payment_Service.Migrations
{
    /// <inheritdoc />
    public partial class FixPaymentColumnNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "User_id",
                table: "Payments",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Payment_Date",
                table: "Payments",
                newName: "PaymentDate");

            migrationBuilder.RenameColumn(
                name: "Card_Expiry_Date",
                table: "Payments",
                newName: "ExpiryDate");

            migrationBuilder.RenameColumn(
                name: "CVV_Number",
                table: "Payments",
                newName: "CVV");

            migrationBuilder.RenameColumn(
                name: "Acount_Number",
                table: "Payments",
                newName: "AccountNumber");

            migrationBuilder.RenameColumn(
                name: "Payment_id",
                table: "Payments",
                newName: "Id");

            migrationBuilder.AddColumn<DateTime>(
                name: "ProcessedDate",
                table: "Payments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TransactionId",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProcessedDate",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "Payments");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Payments",
                newName: "User_id");

            migrationBuilder.RenameColumn(
                name: "PaymentDate",
                table: "Payments",
                newName: "Payment_Date");

            migrationBuilder.RenameColumn(
                name: "ExpiryDate",
                table: "Payments",
                newName: "Card_Expiry_Date");

            migrationBuilder.RenameColumn(
                name: "CVV",
                table: "Payments",
                newName: "CVV_Number");

            migrationBuilder.RenameColumn(
                name: "AccountNumber",
                table: "Payments",
                newName: "Acount_Number");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Payments",
                newName: "Payment_id");
        }
    }
}
