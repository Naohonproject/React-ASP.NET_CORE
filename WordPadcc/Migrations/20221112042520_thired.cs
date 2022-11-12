using Microsoft.EntityFrameworkCore.Migrations;

namespace WordPadcc.Migrations
{
    public partial class thired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsModified",
                table: "WordPadCC",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsModified",
                table: "WordPadCC");
        }
    }
}
