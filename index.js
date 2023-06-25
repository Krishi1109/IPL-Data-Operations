const fs = require("fs");
const readline = require("readline");
var Table = require("cli-table");

var ans = [];
fs.readFile("ipl.csv", "utf8", function (err, data) {
  var arrObj = [];
  var dataArray = data.split(/\r?\n/);
  var header = dataArray[0].split(",");
  for (let i = 1; i < dataArray.length; i++) {
    var rowData = dataArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
    arrObj[i] = {};
    for (let j = 0; j < rowData.length; j++) {
      arrObj[i][header[j]] = rowData[j];
    }
  }

  console.log(
    " 1  Displays all the matches in which the team won the toss and elected the bat first had also won the match for the given input year"
  );
  console.log(
    " 2  Displays all the players with their number of time Man of the matches for the given year. Keeps the higher performing player first"
  );
  console.log(" 3  Displays league table for the given input year");
  console.log(
    " 4  Displays the performance between two given teams for the given year"
  );

  const inquirer = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  inquirer.question("Number?", (num) => {
    switch (num) {
      case "1":
        inquirer.question("Year ?", (year) => {
          var table = new Table({
            head: [
              "Match ID",
              "City",
              "Decision",
              "Player Of The Match",
              "result",
              "Team 1",
              "Team 2",
              "Venue",
              "Toss",
              "Winner",
              "Won By Runs",
              "Won By Wickets",
              "Date",
              "fairplay_points_team_a",
              "fairplay_points_team_b",
            ],
          });
          var ans = [];
          var c = 0;
          for (let i = 1; i < arrObj.length; i++) {
            if (
              arrObj[i].team_a == arrObj[i].winner_toss &&
              arrObj[i].decision == "bat" &&
              arrObj[i].team_a == arrObj[i].winner &&
              arrObj[i].match_date.trim().slice(0, 4) == year
            ) {
              table.push([
                arrObj[i].match_id,
                arrObj[i].city,
                arrObj[i].decision,
                arrObj[i].player_of_match,
                arrObj[i].result,
                arrObj[i].team_a,
                arrObj[i].team_b,
                arrObj[i].venue,
                arrObj[i].winner_toss,
                arrObj[i].winner,
                arrObj[i].won_by_runs,
                arrObj[i].won_by_wickets,
                arrObj[i].match_date.trim(),
                arrObj[i].fairplay_points_team_a,
                arrObj[i].fairplay_points_team_b,
              ]);
            } else if (
              arrObj[i].team_b == arrObj[i].winner_toss &&
              arrObj[i].decision == "bat" &&
              arrObj[i].team_b == arrObj[i].winner &&
              arrObj[i].match_date.trim().slice(0, 4) == year
            ) {
              table.push([
                arrObj[i].match_id,
                arrObj[i].city,
                arrObj[i].decision,
                arrObj[i].player_of_match,
                arrObj[i].result,
                arrObj[i].team_a,
                arrObj[i].team_b,
                arrObj[i].venue,
                arrObj[i].winner_toss,
                arrObj[i].winner,
                arrObj[i].won_by_runs,
                arrObj[i].won_by_wickets,
                arrObj[i].match_date.trim(),
                arrObj[i].fairplay_points_team_a,
                arrObj[i].fairplay_points_team_b,
              ]);
            }
          }
          console.log(table.toString());
        });
        break;

      case "2":
        inquirer.question("Year ?", (year) => {
          var table = new Table({
            head: ["Man Of The Match", "Times"],
          });
          var ans = [];
          let obj1 = {};
          var c = 0;
          for (let i = 1; i < arrObj.length; i++) {
            if (arrObj[i].match_date.trim().slice(0, 4) == year) {
              obj1 = {
                Man_Of_The_Match: arrObj[i].player_of_match,
                date: arrObj[i].match_date.trim(),
                team_1: arrObj[i].team_a,
                team_2: arrObj[i].team_b,
                winner: arrObj[i].winner,
              };
              if (obj1.Man_Of_The_Match != "") {
                ans.push(obj1);
              }
            }
          }

          console.log(ans.length);
          var output = Object.values(
            ans.reduce((obj, { Man_Of_The_Match }) => {
              if (obj[Man_Of_The_Match] === undefined)
                obj[Man_Of_The_Match] = {
                  Times: 1,
                  Man_Of_The_Match: Man_Of_The_Match,
                };
              else obj[Man_Of_The_Match].Times++;
              return obj;
            }, {})
          );

          var byDate = output.slice(0);
          byDate.sort(function (a, b) {
            return b.Times - a.Times;
          });
          console.log(byDate.length);
          for (let i = 0; i < byDate.length; i++) {
            table.push([byDate[i].Times, byDate[i].Man_Of_The_Match]);
          }
          console.log(table.toString());
          inquirer.close();
        });
        break;

      case "3":
        inquirer.question("Year?", (year) => {
          var table = new Table({
            head: [
              "Team",
              "Total match",
              "Total Won",
              "Total loss",
              "Total Tie",
              "Total Fair Play Point",
              "Match Point",
            ],
          });
          for (let i = 1; i < arrObj.length; i++) {
            if (arrObj[i].match_date.trim().slice(0, 4) == year) {
              let obj1 = {
                team_1: arrObj[i].team_a,
                team_2: arrObj[i].team_b,
                team_1_points: arrObj[i].fairplay_points_team_a,
                team_2_points: arrObj[i].fairplay_points_team_b,
                toss: arrObj[i].winner_toss,
                winner: arrObj[i].winner ? arrObj[i].winner : "tie",
                decision: arrObj[i].decision,
                date: arrObj[i].match_date.trim(),
              };
              ans.push(obj1);
            }
          }
          var ans_2 = ans;

          var output = Object.values(
            ans_2.reduce((obj, { team_1 }) => {
              if (obj[team_1] === undefined)
                obj[team_1] = {
                  Times: 1,
                  team_1: team_1,
                };
              else obj[team_1].Times++;
              return obj;
            }, {})
          );

          var c = 0;
          var final_ans = [];
          for (let i = 0; i < output.length; i++) {
            var num_of_matchs = 0;
            var total_win_match = 0;
            var total_loss_match = 0;
            var total_tie = 0;
            var fairplay_points = 0;
            for (let j = 0; j < ans.length; j++) {
              if (
                output[i].team_1 == ans[j].team_1 ||
                output[i].team_1 == ans[j].team_2
              ) {
                if (output[i].team_1 == ans[j].team_1) {
                  fairplay_points =
                    parseInt(fairplay_points) + parseInt(ans[j].team_1_points);
                }
                if (output[i].team_1 == ans[j].team_2) {
                  fairplay_points =
                    parseInt(fairplay_points) + parseInt(ans[j].team_2_points);
                }
                num_of_matchs++;
                if (output[i].team_1 == ans[j].winner) {
                  total_win_match++;
                }
                if (
                  output[i].team_1 != ans[j].winner &&
                  ans[j].winner != "tie"
                ) {
                  total_loss_match++;
                }
                if (ans[j].winner == "tie") {
                  total_tie++;
                }
              }
            }
            table.push([
              output[i].team_1,
              num_of_matchs,
              total_win_match,
              total_loss_match,
              total_tie,
              fairplay_points,
              2 * total_win_match - total_loss_match,
            ]);
          }

          console.log(table.toString());
        });
        break;

      case "4":
        inquirer.question("Year?", (year) => {
          var table = new Table({
            head: [
              "Team",
              "Total Match Played",
              "Total Won",
              "Total FairPlay Points",
            ],
          });
          inquirer.question("First Team : ", (first_team) => {
            var total_match = 0;
            var match_won = 0;
            var points = 0;
            for (let i = 1; i < arrObj.length; i++) {
              if (arrObj[i].match_date.trim().slice(0, 4) == year) {
                if (
                  arrObj[i].team_a == first_team ||
                  arrObj[i].team_b == first_team
                ) {
                  total_match++;
                  if (arrObj[i].team_a == first_team)
                    points =
                      parseInt(points) +
                      parseInt(arrObj[i].fairplay_points_team_a);
                  if (arrObj[i].team_b == first_team)
                    points =
                      parseInt(points) +
                      parseInt(arrObj[i].fairplay_points_team_b);
                  if (first_team == arrObj[i].winner) {
                    match_won++;
                  }
                }
              }
            }
            table.push([first_team, total_match, match_won, points]);
            inquirer.question("Second Team : ", (second_team) => {
              var total_match = 0;
              var match_won = 0;
              var points = 0;
              for (let i = 1; i < arrObj.length; i++) {
                if (arrObj[i].match_date.trim().slice(0, 4) == year) {
                  if (
                    arrObj[i].team_a == second_team ||
                    arrObj[i].team_b == second_team
                  ) {
                    total_match++;
                    if (arrObj[i].team_a == second_team)
                      points =
                        parseInt(points) +
                        parseInt(arrObj[i].fairplay_points_team_a);
                    if (arrObj[i].team_b == second_team)
                      points =
                        parseInt(points) +
                        parseInt(arrObj[i].fairplay_points_team_b);
                    if (second_team == arrObj[i].winner) {
                      match_won++;
                    }
                  }
                }
              }
              table.push([second_team, total_match, match_won, points]);
              console.log(table.toString());
            });
          });
        });
        break;

      default:
        console.log("Invalid Number");
        break;
    }
  });
});

