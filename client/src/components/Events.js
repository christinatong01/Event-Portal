import React, { Component } from "react";
import EventRow from "./EventRow.js";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import EventsStyles from "../styles/Events.js";
import Divider from "@material-ui/core/Divider";

class Events extends Component {
  _isMounted = false;

  constructor() {
    super();

    this.getEvents = this.getEvents.bind(this);
    this.state = {
      eventsByDayArray: {},
      loading: false,
      date: "",
      prevY: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getEvents();

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );

    this.observer.observe(this.loadingRef);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      let lastDate;
      for (let val in this.state.eventsByDayArray) {
        if (this.state.eventsByDayArray.hasOwnProperty(val)) {
          lastDate = this.state.eventsByDayArray[val][0].starts_at
        }
      }
      this.getEvents(lastDate);
      this.setState({ date: lastDate });
    }
    this.setState({ prevY: y });
  }

  getEvents(date) {
    this.setState({ loading: true });
    axios
      .get("/locations")
      .then(result => {
        var locationsData = [];
        result.data.forEach(function(location) {
          locationsData[location.id] = location;
        });

        let options = {
          params: {
            sort: "date",
            limit: '10',
            start_date: date,
          }
        };

        axios
          .get("/events", options)
          .then(result => {
            let eventsData = result.data.map(function(event) {
              return {
                fb_id: event.fb_id,
                name: event.name,
                starts_at: event.starts_at,
                ends_at: event.ends_at,
                location_id: event.location_id,
                location: event.location_id
                  ? locationsData[event.location_id].name
                  : "",
                description: event.description,
                fb_event: event.fb_event,
                picture: event.picture,
                is_featured: event.is_featured,
                updated_at: event.updated_at,
                created_at: event.created_at,
                period: event.period,
                week: event.week
              };
            });

            function groupByDate(arr) {
              return arr.reduce(function(memo, event) {
                let startOfDate = new Date(
                  new Date(event["starts_at"]).setUTCHours(0, 0, 0, 0)
                );
                let endOfDate = new Date(
                  new Date(event["ends_at"]).setUTCHours(0, 0, 0, 0)
                );

                for (
                  var date = new Date(startOfDate);
                  date.getTime() <= endOfDate.getTime();
                  date.setUTCDate(date.getUTCDate() + 1)
                ) {
                  // if event's date < today's date then don't display
                  if (!memo[new Date(date)]) {
                    memo[new Date(date)] = [];
                  }
                  memo[new Date(date)].push(event);
                }

                return memo;
              }, {});
            }

            let eventsArray = groupByDate(eventsData);

            this.setState({
              eventsByDayArray: {...this.state.eventsByDayArray, ...eventsArray}
            });
            this.setState({ loading: false });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  // Little hacky: compares non-UTC to UTC time because new Date() doesn't give UTC time
  sameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getUTCFullYear() &&
      d1.getMonth() === d2.getUTCMonth() &&
      d1.getDate() === d2.getUTCDate()
    );
  };

  getFormattedDate = date => {
    let today = new Date();
    const month = date.toLocaleString("default", { month: "long" });

    let tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    if (this.sameDay(today, date))
      return "Today, " + month + " " + date.getUTCDate();
    else if (this.sameDay(tomorrow, date))
      return "Tomorrow, " + month + " " + date.getUTCDate();
    else {
      let formattedDate = month + " " + date.getUTCDate();
      if (today.getFullYear() !== date.getUTCFullYear())
        formattedDate += ", " + date.getUTCFullYear();
      return formattedDate;
    }
  };

  renderEventRows = () => {
    const { classes } = this.props;
    let eventRows = [];
    var dividerIndex = 0;

    for (var start_date in this.state.eventsByDayArray) {
      if (this.state.eventsByDayArray.hasOwnProperty(start_date)) {
        eventRows.push(
          <EventRow
            key={start_date}
            events={this.state.eventsByDayArray[start_date]}
            name={this.getFormattedDate(new Date(start_date))}
          />
        );
        eventRows.push(
          <Divider key={dividerIndex} className={classes.line}></Divider>
        );
        dividerIndex++;
      }
    }
    return eventRows;
  };

  render() {
    const { classes } = this.props;
    const loadingCSS = {
      height: "100px",
      margin: "30px"
    }
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

    return (
      <div className={classes.container}>
        <div className={classes.whiteBackground}>
          <div className={classes.events}>{this.renderEventRows()}</div>
        </div>
        <div
          ref = {loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </div>
    );
  }
}

export default withStyles(EventsStyles)(Events);
