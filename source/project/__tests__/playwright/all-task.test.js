const { test, expect, _electron: electron } = require('@playwright/test');

const mgr =

    test.describe('All Tasks Functionality', () => {
        let electronApp;
        let window;

        test.beforeAll(async () => {
            // Launch Electron app
            electronApp = await electron.launch({ args: ['.'] }); // Adjust the path to your Electron app
            window = await electronApp.firstWindow();

            await window.waitForSelector("#menu");
            const navBtn = await window.$$("#menu");
            await navBtn[0].click();

            await window.waitForSelector("#tasks");
            const taskBtn = await window.$$("#tasks");
            await taskBtn[0].click();

            // Mocking the window.path and window.api methods
            /* await window.evaluate(() => {
                window.path = {
                    getUserData: async () => {
                        return '/mock/app/data/path';
                    }
                };

                window.api = {
                    connect: (userData, callback) => {
                        console.log(`Mock connect to ${userData}`);
                        callback();
                    },
                    init: (callback) => {
                        console.log('Mock init database');
                        callback();
                    },
                    getFilteredTasks: (filters, callback) => {
                        const tasks = [
                            {
                                task_name: 'Task 1 05-15',
                                task_content: 'This is the first task',
                                due_date: '2024-06-01',
                                creation_date: '2024-05-15T01:30',
                                priority: 'P1',
                                expected_time: '2'
                            },
                            {
                                task_name: 'Task 2 06-05',
                                task_content: 'This is the second task',
                                due_date: '2024-06-05',
                                creation_date: '2024-05-30T01:30',
                                priority: 'P2',
                                expected_time: '1'
                            },
                            {
                                task_name: 'Task 3 06-10',
                                task_content: 'This is the third task',
                                due_date: '2024-06-10',
                                creation_date: '2024-06-01T01:30',
                                priority: 'P1',
                                expected_time: '3'
                            }
                        ];
                        callback(tasks);
                    }
                };
            }); */
        });

        test.afterAll(async () => {
            await electronApp.close();
        });

        // test('should display tasks on load', async () => {
        //     await window.reload();

        //     const tasks = await window.locator('.task-container');
        //     // await expect(tasks).toHaveCount(3);
        //     // await expect(tasks.nth(0)).toContainText('Task 1 05-15');
        //     // await expect(tasks.nth(1)).toContainText('Task 2 06-05');
        //     // await expect(tasks.nth(2)).toContainText('Task 3 06-10');
        // });

        /* test('should filter tasks based on search input', async () => {
            await window.fill('#searchInput', 'Task 1');
            await window.evaluate(() => {
                const event = new Event('input', { bubbles: true });
                document.getElementById('searchInput').dispatchEvent(event);
            });

            const tasks = await window.locator('.task-container');
            await expect(tasks).toHaveCount(1);
            // await expect(tasks).toContainText('Task 1 05-15');
        }); */

        // test('should open task popup on add task button click', async () => {
        //     // await window.click('#add-task');
        //     // const taskPopup = await window.locator('.open-task-popup');
            
        //     // Click the add task button
        //     await window.waitForSelector("#menu");
        //     const navBtn = await window.$$("#menu");
        //     await navBtn[0].click();

        //     const addTask = await window.$$("#open-task-popup");
        //     await addTask[0].click();
        //     // Locate the task popup
        //     const taskPopup = window.locator('.open-task-popup');
            
        //     // Assert that the task popup is visible
        //     await expect(taskPopup).toBeVisible();
        // });

        test('should navigate to calendar view on calendar link click', async () => {
            //await window.click('#vault');
            await window.waitForSelector("#menu");
            const navBtn = await window.$$("#menu");
            await navBtn[0].click();

            await window.waitForSelector("#calendar");
            const vaultBtn = await window.$$("#calendar");
            await vaultBtn[0].click();
            await expect(window).toHaveURL(/.*mainview\.html$/);
        });

        test('should navigate to vault view on vault link click', async () => {
            await window.waitForSelector("#menu");
            const navBtn = await window.$$("#menu");
            await navBtn[0].click();

            await window.waitForSelector("#vault");
            const vaultBtn = await window.$$("#vault");
            await vaultBtn[0].click();
            //await window.click('#vault');
            await expect(window).toHaveURL(/.*vault\.html$/);
        });

        test('should toggle menu options on menu button click', async () => {
            const menuButton = await window.locator('#menu');
            const menuOptions = await window.locator('#menu-options');

            await menuButton.click();
            await expect(menuOptions).toBeVisible();

            await menuButton.click();
            await expect(menuOptions).not.toBeVisible();
        });

        test('should hide menu options on outside click', async () => {
            const menuButton = await window.locator('#menu');
            const menuOptions = await window.locator('#menu-options');

            await menuButton.click();
            await expect(menuOptions).toBeVisible();

            await window.click('body');
            await expect(menuOptions).not.toBeVisible();
        });

    });