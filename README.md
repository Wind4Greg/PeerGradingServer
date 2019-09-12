# Assignment/Peer-Review Server

## Introduction

This project is primarily a teaching tool for the web development classes I occasionally teach. Whether it gets completed depends on my students and my time allotment.

Current Technologies:

1. Express.js server
2. NEDB database to illustrate the use of a document oriented (noSQL) database with minimal configuration hassles.
3. Mocha, Chai, and SuperTest for development and testing of the web server API.
4. Bcrypt.js just to make sure we never store passwords in the clear on a server.
5. Markdown, Prism.js for display and syntax highlighting.

Planned Technologies:
1. Express-Session for session management and RBAC.
2. HTTPS infrastructure.

**Note the GUI** is a separate project that the students are working on and is implemented via React.

## Project Motivation/Scope

Observations on *Learning Management Systems* (LMS):

* Instructors do not get to choose the LMS their school (college, cuniversity) uses.

* Most LMSs are ***unfriendly*** to most code files such as CSS, JavaScript, HTML, Markdown. Hence terrible for *coding* classes.

* Need help for **coding** classes since these have the most problematic file types.

Scope restrictions to make a minimum viable project (MVP):

* A Multi-user assignment submission and peer review system
* Three main roles: administrator, teacher, and student
* Input format restricted to Markdown with supplementary images in PNG and JPEG format.
* Teacher control of assignments and peer review process

See [Design Project Slides](https://www.grotto-networking.com/WebSystems/files/lectures/Misc/DesignProject1.html) for a bit more information.

## Next Steps

1. Add login and logout functionality
2. Add role checks into API
3. Images in Markdown submissions
    1. How to store?
    2. Uploading images?


