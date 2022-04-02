<?php
$title = "Countdown Generator";
require 'config.php';

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- app -->
    <link rel="stylesheet" href="<?= APP_PATH ?>style.css">
    <script type="module" src="<?= APP_PATH ?>app.js" defer></script>
    <!-- countdown parts -->
    <link rel="stylesheet" href="<?= APP_PATH ?>export/css/countdown.css">
    <link rel="stylesheet" href="<?= APP_PATH ?>export/css/dark.css" id="countdown-theme">
    <link rel="stylesheet" href="<?= APP_PATH ?>export/css/animations.css">
    <!-- fonts -->
    <link rel="stylesheet" href="<?= APP_PATH ?>lib/fonts/montserrat/montserrat.css">
    <!-- libs -->
    <link rel="stylesheet" href="<?= APP_PATH ?>components/popup/popup.css">
    <link rel="stylesheet" href="<?= APP_PATH ?>components/tooltip/tooltip.css">
    <script src="<?= APP_PATH ?>lib/js/gsap/gsap.min.js" defer></script>

    <title><?= $title ?></title>
</head>

<body>

    <div class="title-container">
        <h1><?= $title ?></h1>
    </div>

    <div class="countdown-generator">

        <div class="form-wrapper">
            <form class="form-container">
                <div class="form-group select" id="type">
                    <label for="type">Type</label>
                    <select name="type">
                        <option value="evergreen">Evergreen (uses cookies)</option>
                        <option value="deadline">End date (no cookies)</option>
                        <option value="duration">Duration (no cookies)</option>
                    </select>
                </div>
                <div class="form-group input" id="endDate">
                    <label for="end-date">End date</label>
                    <input type="date" name="end-date" value="<?= (new DateTime())->format('Y-m-d') ?>">
                </div>
                <div class="form-group input" id="endTime">
                    <label for="end-date">End time</label>
                    <input type="time" name="end-time" value="<?= (new DateTime("+1hour"))->format('H:i') ?>">
                </div>
                <div class="form-group input" id="daysDuration">
                    <label for="days-duration">Duration in days</label>
                    <input type="number" name="days-duration" value="1">
                </div>
                <label>Options</label>
                <div class="form-group checkbox" id="animations">
                    <label class="check">
                        <input type="checkbox" name="options[]" value="animations">
                        Play animations
                    </label>
                </div>
                <div class="form-group select" id="theme">
                    <label for="theme">Thème</label>
                    <select name="theme">
                        <option value="dark">Plain</option>
                        <option value="light">Light</option>
                        <option value="border">Border</option>
                    </select>
                </div>
                <button type="submit" id="submitBtn">Generate countdown</button>
            </form>
        </div>

        <div class="countdown-wrapper">
            <?php require 'export/countdown.html' ?>
            <div class="code-export-container">
                <textarea name="code-export" id="code-export"></textarea>
                <button class="export-copy-btn">Copy code</button>
            </div>
        </div>

    </div>

</body>

</html>