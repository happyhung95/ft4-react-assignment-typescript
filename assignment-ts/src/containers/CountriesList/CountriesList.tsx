import React, { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles'
import {
  useMediaQuery,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Divider,
} from '@material-ui/core'

import AddButton from '../../components/AddButton'
import ThemeContext from '../../context'
import { AppState } from '../../types'
import useStyles from './styles'

function CountriesList() {
  // countries is already sorted in the saga
  let data = useSelector((state: AppState) => state.countries.countries)
  const searchKey = useSelector((state: AppState) => state.ui.searchKey)
  const [ascendingOrder, setSortOrder] = useState(true)
  const [countries, setCountries] = useState(data)
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    setCountries(data)
  }, [data])

  useEffect(() => {}, [ascendingOrder])

  const handleSort = () => {
    setSortOrder(!ascendingOrder)
    countries.reverse()
    setCountries(countries)
  }

  const classes = useStyles()

  const renderMobile = () => (
    <div style={{ marginTop: 60 }}>
      {countries
        .filter(({ name }) =>
          name.toLowerCase().includes(searchKey.toLowerCase())
        )
        .map((country) => (
          <div className={classes.root} key={country.name}>
            <Paper className={classes.paper}>
              <Grid container direction="column" alignItems="center">
                <Link
                  to={`/react-redux-countries-app/country/${country.name}`}
                  className={classes.image}
                >
                  <img
                    className={classes.img}
                    src={country.flag}
                    alt={country.name}
                  />
                </Link>
                <Typography variant="h5">
                  <Link
                    to={`/react-redux-countries-app/country/${country.name}`}
                    className={classes.countryName}
                    style={{ color: theme.color }}
                  >
                    {country.name}
                  </Link>
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Population
                </Typography>
                <Typography variant="body1">
                  {new Intl.NumberFormat('fi-FI', { useGrouping: true }).format(
                    country.population
                  )}
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Languages
                </Typography>
                <Typography variant="body1">
                  {country.languages
                    .map((language) => language.name)
                    .join(', ')}
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Region
                </Typography>
                <Typography gutterBottom variant="body1">
                  {country.region}
                </Typography>
                <AddButton country={country} />
                <Divider />
              </Grid>
            </Paper>
          </div>
        ))}
    </div>
  )

  const renderDesktop = () => (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHead}>Flag</TableCell>
            <TableCell className={classes.tableHead}>
              <TableSortLabel
                direction={ascendingOrder ? 'asc' : 'desc'}
                onClick={handleSort}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.tableHead}>Languages</TableCell>
            <TableCell className={classes.tableHead}>Population</TableCell>
            <TableCell className={classes.tableHead}>Region</TableCell>
            <TableCell>{/*button column */}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries
            .filter(({ name }) =>
              name.toLowerCase().includes(searchKey.toLowerCase())
            )
            .map((country) => (
              <TableRow key={country.name}>
                <TableCell className={classes.image}>
                  <Link
                    to={`/react-redux-countries-app/country/${country.name}`}
                  >
                    <img
                      className={classes.img}
                      src={country.flag}
                      alt={country.name}
                    />
                  </Link>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link
                    to={`/react-redux-countries-app/country/${country.name}`}
                    className={classes.countryName}
                  >
                    {country.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {country.languages.map(({ name }) => (
                    <li key={name}>{name}</li>
                  ))}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fi-FI', { useGrouping: true }).format(
                    country.population
                  )}
                </TableCell>
                <TableCell>{country.region}</TableCell>
                <TableCell>
                  <AddButton country={country} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  // Responsive render
  const themeMUI = useTheme()
  const desktopView = useMediaQuery(themeMUI.breakpoints.up('sm')) // min view width = 600px

  return <>{desktopView ? renderDesktop() : renderMobile()}</>
}

export default CountriesList
